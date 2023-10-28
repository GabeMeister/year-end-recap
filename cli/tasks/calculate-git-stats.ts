import { runExec } from "../utils/shell";
import repos, { Repo } from "../data/repos";
import db from "../../src/db/client";
import { AuthorCommits, RepoRecap } from "../../src/types/git";

function getAuthorName(
  name: string,
  duplicateAuthors: Record<string, string>
): string {
  return duplicateAuthors[name] ? duplicateAuthors[name] : name;
}

async function calculateGitCommits(repo: Repo): Promise<AuthorCommits[]> {
  console.log("Calculating git stats...");

  const output = await runExec(
    `mergestat 'SELECT author_name as name, count(*) as commits
      FROM commits GROUP BY name 
      HAVING commits > 10
      ORDER BY commits desc;' -f json`,
    {
      cwd: repo.path,
    }
  );
  const authorCommits: AuthorCommits[] = JSON.parse(output);

  const authorNameMap: Record<string, number> = {};
  authorCommits.forEach((author) => {
    const realName = getAuthorName(author.name, repo.duplicateAuthors);

    if (realName in authorNameMap) {
      authorNameMap[realName] += author.commits;
    } else {
      authorNameMap[realName] = author.commits;
    }
  });

  const final: AuthorCommits[] = [];
  Object.keys(authorNameMap).forEach((name) => {
    final.push({
      name,
      commits: authorNameMap[name],
    });
  });

  final.sort((a, b) => {
    if (a.commits > b.commits) {
      return -1;
    } else if (a.commits < b.commits) {
      return 1;
    } else {
      return 0;
    }
  });

  return final;
}

async function gitPullRepo(path: string) {
  console.log("Pulling repo...");

  await runExec("git pull", {
    cwd: path,
  });
}

async function upsertCommitStats(repo: Repo, commits: AuthorCommits[]) {
  console.log("Upserting git commit stats...");

  const now = new Date(Date.now());
  const repoRecap: RepoRecap = {
    version: 1,
    allTimeAuthorCommits: commits,
  };

  await db
    .insertInto("repos")
    .values({
      name: repo.name,
      url: repo.url,
      ssh_url: repo.sshCloneUrl,
      created_date: now,
      updated_date: now,
      duplicate_authors: repo.duplicateAuthors,
      data: repoRecap,
    })
    .onConflict((oc) =>
      oc.column("url").doUpdateSet({
        updated_date: now,
        duplicate_authors: repo.duplicateAuthors,
        data: repoRecap,
      })
    )
    .execute();
}

async function task() {
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];

    console.log("\n\n\n==== REPO:", repo.name, " ====\n");

    await gitPullRepo(repo.path);
    const commitStats = await calculateGitCommits(repo);
    await upsertCommitStats(repo, commitStats);
  }

  console.log("\n\nDone!");
}

export default task;
