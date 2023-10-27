import execa from "execa";
import { DUPLICATE_GIT_AUTHOR_NAME_MAP } from "./constants";
import { CommitData, SummaryData } from "../../src/types/git";

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
