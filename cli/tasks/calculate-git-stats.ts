import { pickBy } from "lodash";
import { runExec } from "../utils/shell";
import repos, { Repo } from "../data/repos";
import db from "../../src/db/client";
import {
  AuthorCommits,
  AuthorData,
  AuthorFirstCommit,
  AuthorFirstCommits,
  RepoRecap,
} from "../../src/types/git";

function getAuthorName(
  name: string,
  duplicateAuthors: Record<string, string>
): string {
  if (name in duplicateAuthors) {
    return duplicateAuthors[name];
  } else {
    return name;
  }
}

async function getCommitsByAuthor(repo: Repo): Promise<AuthorCommits[]> {
  console.log("Calculating git stats...");

  const output = await runExec(
    `mergestat 'SELECT author_name as name, count(*) as commits
      FROM commits GROUP BY name 
      HAVING commits > 1
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

async function getAuthorFirstCommits(repo: Repo): Promise<AuthorFirstCommits> {
  let stdout = await runExec(
    `mergestat 'select author_name as name, min(author_when) as first_commit from commits group by author_name;' -f json`,
    {
      cwd: repo.path,
    }
  );

  type RawOutput = {
    first_commit: string;
    name: string;
  };

  const output: RawOutput[] = JSON.parse(stdout);
  const authorFirstCommits: AuthorFirstCommits = {};

  output.forEach((a) => {
    const realName = getAuthorName(a.name, repo.duplicateAuthors);
    const firstCommitDate = new Date(a.first_commit);

    if (
      realName in authorFirstCommits &&
      firstCommitDate < authorFirstCommits[realName]
    ) {
      authorFirstCommits[realName] = firstCommitDate;
    } else if (!(realName in authorFirstCommits)) {
      authorFirstCommits[realName] = firstCommitDate;
    }
  });

  return authorFirstCommits;
}

async function getAuthorCounts(repo: Repo): Promise<AuthorData> {
  const authorFirstCommits: AuthorFirstCommits = await getAuthorFirstCommits(
    repo
  );

  const now = new Date(Date.now());
  const beginningOfYear = new Date(now.getFullYear(), 0, 1);
  const prevYearFirstCommits: AuthorFirstCommits = pickBy(
    authorFirstCommits,
    (v) => {
      return v < beginningOfYear;
    }
  );
  const currYearFirstCommits: AuthorFirstCommits = pickBy(
    authorFirstCommits,
    (v) => {
      return v >= beginningOfYear;
    }
  );

  const newAuthors: AuthorFirstCommit[] = [];

  for (let [k, v] of Object.entries(currYearFirstCommits)) {
    newAuthors.push({
      name: k,
      first_commit: v,
    });
  }
  newAuthors.sort((a, b) => {
    if (a.first_commit > b.first_commit) {
      return -1;
    } else {
      return 1;
    }
  });

  return {
    previousYearCount: Object.keys(prevYearFirstCommits).length,
    currentYearCount: Object.keys(authorFirstCommits).length,
    newAuthors,
  };
}

async function gitPullRepo(path: string) {
  console.log("Pulling repo...");

  await runExec("git pull", {
    cwd: path,
  });
}

type RepoStats = {
  commitData: AuthorCommits[];
  authorData: AuthorData;
};

async function upsertRepo(repo: Repo, stats: RepoStats) {
  console.log("Upserting git commit stats...");

  const now = new Date(Date.now());
  const repoRecap: RepoRecap = {
    version: 1,
    allTimeAuthorCommits: stats.commitData,
    newAuthors: stats.authorData,
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
    const commitData = await getCommitsByAuthor(repo);
    const authorData = await getAuthorCounts(repo);

    await upsertRepo(repo, { commitData, authorData });
  }

  console.log("\n\nDone!");
}

export default task;
