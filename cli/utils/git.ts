import execa from "execa";
import { DUPLICATE_GIT_AUTHOR_NAME_MAP } from "./constants";
import { CommitData, CommitStat, SummaryData } from "../../src/types/git";
import { CommonTableExpressionNameNode } from "kysely";

export type RepoHost = "github" | "gitlab";

export type RawCommit = {
  name: string;
  date: string;
  message: string;
};

export function getHost(repoUrl: string): RepoHost {
  return repoUrl.includes("github") ? "github" : "gitlab";
}

export function getAuthorName(name: string): string {
  return DUPLICATE_GIT_AUTHOR_NAME_MAP[name] ?? name;
}

export async function getGitAuthorCommits(repo: string): Promise<RawCommit[]> {
  const { stdout } = await execa(
    "mergestat",
    [
      "SELECT author_name as name, author_when as date, message FROM commits order by author_when",
      "-f",
      "json",
    ],
    {
      cwd: repo,
    }
  );

  const commits: RawCommit[] = JSON.parse(stdout);

  return commits;
}

export async function getGitAuthorSummary(repo: string): Promise<SummaryData> {
  const { stdout } = await execa(
    "mergestat",
    [
      "SELECT author_name as name, count(*) as commits FROM commits group by name order by commits desc;",
      "-f",
      "json",
    ],
    {
      cwd: repo,
    }
  );

  const data: CommitData[] = JSON.parse(stdout);
  const summaryData: SummaryData = data.reduce<Record<string, number>>(
    (result, item) => {
      const authorName = getAuthorName(item.name);

      if (result.hasOwnProperty(authorName)) {
        result[authorName] += item.commits;
      } else {
        result[authorName] = item.commits;
      }

      return result;
    },
    {}
  );

  return summaryData;
}

export function getChangesFromGitLogStr(line: string): CommitStat {
  const stats = line
    .trim()
    .split(",")
    .map((part) => {
      part = part.trim();

      if (part.includes("files changed") || part.includes("file changed")) {
        const count = parseInt(
          part.replace(" files changed", "").replace(" file changed", "")
        );

        return { filesChanged: count };
      } else if (part.includes("insertions") || part.includes("insertion")) {
        const count = parseInt(
          part.replace(" insertions(+)", "").replace(" insertion(+)", "")
        );

        return { insertions: count };
      } else if (part.includes("deletions") || part.includes("deletion")) {
        const count = parseInt(
          part.replace(" deletions(-)", "").replace(" deletion(-)", "")
        );

        return { deletions: count };
      } else {
        throw new Error(`Unrecognized part from git log string: ${part}`);
      }
    });

  const commitStats: CommitStat = {
    filesChanged: 0,
    insertions: 0,
    deletions: 0,
  };

  stats.forEach((stat) => {
    for (const [key, value] of Object.entries(stat)) {
      commitStats[key] += value;
    }
  });

  return commitStats;
}
