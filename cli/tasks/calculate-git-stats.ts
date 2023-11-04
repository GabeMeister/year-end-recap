import { pickBy } from "lodash";
import { createDateMap, getDateStr, getLastDayOfYearStr } from "../utils/date";
import { uniqBy } from "lodash";
import { runExec } from "../utils/shell";
import repos, { Repo } from "../data/repos";
import db from "../../src/db/client";
import {
  AuthorCommits,
  TeamAuthorData,
  AuthorFirstCommit,
  AuthorFirstCommits,
  RepoRecap,
  TeamCommitData,
  FileCount,
  LinesOfCode,
  LongestFiles,
  AuthorCommitsOverTime,
  CommitStat,
  LineChangeStat,
} from "../../src/types/git";
import {
  getUnixTimeAtMidnight,
  getFirstDayOfYearStr,
  getDateAtMidnight,
} from "../utils/date";
import { RawCommit } from "../utils/git";
import { NumberObject } from "../../src/types/general";
import { clone } from "../utils/object";

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

async function gitPullRepo(path: string) {
  console.log("Pulling repo...");

  await runExec("git pull", {
    cwd: path,
  });
}

async function getCommitsByAuthor(repo: Repo): Promise<AuthorCommits[]> {
  console.log("Getting commits by author...");

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

async function getTeamAuthorCounts(repo: Repo): Promise<TeamAuthorData> {
  console.log("Getting team size...");

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

async function getTeamCommitCount(repo: Repo): Promise<TeamCommitData> {
  console.log("Getting team-wide commit totals...");

  const now = new Date(Date.now());
  const stdout1 = await runExec(
    `mergestat "select count(*) as count from commits where author_when < '${now.getFullYear()}-01-01'" -f json`,
    {
      cwd: repo.path,
    }
  );

  type RawOutput = {
    count: number;
  };

  const prevYear: RawOutput = JSON.parse(stdout1)[0];

  const stdout2 = await runExec(
    `mergestat "select count(*) as count from commits where author_when >= '${now.getFullYear()}-01-01'" -f json`,
    {
      cwd: repo.path,
    }
  );

  const currYear: RawOutput = JSON.parse(stdout2)[0];

  return {
    prevYear: prevYear.count,
    currYear: prevYear.count + currYear.count,
  };
}

async function getLastCommitFromPrevYear(repo: Repo): Promise<string> {
  const firstDayOfYear = getFirstDayOfYearStr();
  let stdout = await runExec(
    `mergestat "select hash, max(author_when) as last_commit from commits where author_when < '${firstDayOfYear}';" -f json`,
    {
      cwd: repo.path,
    }
  );

  type RawOutput = {
    hash: string;
    last_commit: string;
  };

  const output: RawOutput = JSON.parse(stdout)[0];

  return output.hash;
}

async function getFileCount(repo: Repo): Promise<FileCount> {
  console.log("Getting file counts...");

  const excludeDirStr =
    "\\( " + repo.excludeDirs.map((d) => `-name "${d}"`).join(" -o ") + " \\)";
  const includeFileStr =
    "\\( " +
    repo.includeFiles.map((f) => `-name "*.${f}"`).join(" -o ") +
    " \\)";

  const cmd1 = `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | wc -l`;
  const stdout1 = await runExec(cmd1, {
    cwd: repo.path,
  });

  const currYear: number = JSON.parse(stdout1);

  const finalPrevYearCommit = await getLastCommitFromPrevYear(repo);

  console.log(`Checking out repo to commit ${finalPrevYearCommit}...`);
  await runExec(`git checkout ${finalPrevYearCommit}`, {
    cwd: repo.path,
  });

  const cmd2 = `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | wc -l`;
  const stdout2 = await runExec(cmd2, {
    cwd: repo.path,
  });

  const prevYear: number = JSON.parse(stdout2);

  console.log(`Checking out repo to master...`);
  await runExec(`git checkout ${repo.masterBranch}`, {
    cwd: repo.path,
  });

  return {
    prevYear,
    currYear,
  };
}

async function getLinesOfCode(repo: Repo): Promise<LinesOfCode> {
  console.log("Getting lines of code...");

  const excludeDirStr = repo.excludeDirs.join(",");
  const includeFileStr = repo.includeFiles.join(",");

  const cmd1 = `npx cloc . --include-ext=${includeFileStr} --exclude-dir=${excludeDirStr} --json`;
  const stdout1 = await runExec(cmd1, {
    cwd: repo.path,
  });

  type RawOutput = {
    SUM: {
      blank: number;
      comment: number;
      code: number;
      nFiles: number;
    };
  };

  const output: RawOutput = JSON.parse(stdout1);

  const finalPrevYearCommit = await getLastCommitFromPrevYear(repo);

  console.log(`Checking out repo to commit ${finalPrevYearCommit}...`);
  await runExec(`git checkout ${finalPrevYearCommit}`, {
    cwd: repo.path,
  });

  const stdout2 = await runExec(cmd1, {
    cwd: repo.path,
  });

  const output2: RawOutput = JSON.parse(stdout2);

  console.log(`Checking out repo to master...`);
  await runExec(`git checkout ${repo.masterBranch}`, {
    cwd: repo.path,
  });

  return {
    prevYear: output2.SUM.blank + output2.SUM.code + output2.SUM.comment,
    currYear: output.SUM.blank + output.SUM.code + output.SUM.comment,
  };
}

async function getLongestFiles(repo: Repo): Promise<LongestFiles> {
  console.log("Getting longest files...");

  const includeFileStr = repo.includeFiles.map((f) => `'*.${f}'`).join(" ");
  const cmd1 = `git ls-files ${includeFileStr} | xargs wc -l | sort -rh | head -n 4`;
  const stdout1 = await runExec(cmd1, {
    cwd: repo.path,
  });

  const longestFiles = stdout1
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !!l)
    .map((l) => {
      const tokens = l.split(" ");
      return {
        lines: parseInt(tokens[0]),
        path: tokens[1],
      };
    })
    .filter((o) => o.path !== "total");

  return longestFiles;
}

async function getGitAuthorCommits(
  repo: string,
  authorsToInclude: string[]
): Promise<RawCommit[]> {
  const authorSqlStr = authorsToInclude.map((a) => `'${a}'`).join(",");
  const beginningOfYear = getFirstDayOfYearStr();
  const stdout = await runExec(
    `mergestat "SELECT author_name as name, author_when as date FROM commits where author_when >= '${beginningOfYear}' and author_name in (${authorSqlStr}) order by author_when" -f json`,
    {
      cwd: repo,
    }
  );

  const commits: RawCommit[] = JSON.parse(stdout);

  return commits;
}

async function getTopAuthors(repo: Repo): Promise<string[]> {
  const duplicateAuthors = Object.keys(repo.duplicateAuthors)
    .map((a) => `'${a}'`)
    .join(",");

  const stdout = await runExec(
    `mergestat "SELECT author_name as name, count(*) as count
      FROM commits 
      WHERE name not in (${duplicateAuthors}) 
      GROUP BY name 
      ORDER BY count desc" -f json`,
    {
      cwd: repo.path,
    }
  );

  const authorCommits: AuthorCommits[] = JSON.parse(stdout);

  // Some repos (like Next.js) have over 3,000 contributors. So we just pick the top 20.
  const final = authorCommits.slice(0, 20).map((a) => a.name);

  return final;
}

async function getAuthorCommitsOverTime(
  repo: Repo
): Promise<AuthorCommitsOverTime> {
  console.log("Getting author commits over time...");
  const topAuthors = await getTopAuthors(repo);

  const commits = await getGitAuthorCommits(repo.path, topAuthors);

  const allAuthors: string[] = uniqBy(
    commits.map((c) => c.name),
    (c) => c
  );
  const allDates: Date[] = uniqBy(
    commits.map((c): number => {
      return getUnixTimeAtMidnight(c.date);
    }),
    (d) => d
  ).map((d) => new Date(d));

  const authorToCommitMap: NumberObject = {};
  allAuthors.forEach((a) => {
    authorToCommitMap[getAuthorName(a, repo.duplicateAuthors)] = 0;
  });

  // INITIALIZE THE BIG [Date] -> {AUTHOR/COMMIT MAP}
  const dateToAuthorCommits = createDateMap<NumberObject>();

  allDates.forEach((d) => {
    const map = clone(authorToCommitMap);
    dateToAuthorCommits.set(d, map);
  });

  commits.forEach((c) => {
    const d = dateToAuthorCommits.get(getDateAtMidnight(c.date));
    if (!d) {
      throw new Error(`Unrecognized commit date for ${JSON.stringify(d)}`);
    }

    d[getAuthorName(c.name, repo.duplicateAuthors)]++;
  });

  const cumulativeCommits: AuthorCommitsOverTime = [];
  const cumulativeAuthorCommitMap = clone(authorToCommitMap);
  for (let [k, v] of dateToAuthorCommits.all()) {
    for (let [name, numCommits] of Object.entries(v)) {
      cumulativeCommits.push({
        date: k.toISOString(),
        name,
        value:
          cumulativeAuthorCommitMap[getAuthorName(name, repo.duplicateAuthors)],
      });

      cumulativeAuthorCommitMap[getAuthorName(name, repo.duplicateAuthors)] +=
        numCommits;
    }
  }

  return cumulativeCommits;
}

async function getTeamCommitsForYear(repo: Repo): Promise<number> {
  console.log("Getting team commits for year...");

  const firstDayStr = getFirstDayOfYearStr();
  const stdout = await runExec(
    `mergestat "SELECT count(*) as count FROM commits where author_when > '${firstDayStr}'" -f json`,
    {
      cwd: repo.path,
    }
  );

  const count: number = JSON.parse(stdout)[0].count;

  return count;
}

async function getTeamChangedLinesForYear(repo: Repo): Promise<LineChangeStat> {
  console.log("Getting team changed lines for year...");

  const firstDayStr = getFirstDayOfYearStr();
  const lastDayStr = getLastDayOfYearStr();
  const stdout = await runExec(
    `git log --since="${firstDayStr}" --until="${lastDayStr}" --stat | grep -E "insertions|deletions"`,
    {
      cwd: repo.path,
    }
  );

  const allCommitStats: CommitStat[] = stdout.split("\n").map((l) => {
    const tokens = l
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
        }
      });

    const commitStats: CommitStat = {
      filesChanged: 0,
      insertions: 0,
      deletions: 0,
    };
    tokens.forEach((t) => {
      commitStats.filesChanged += t?.filesChanged ?? 0;
      commitStats.insertions += t?.insertions ?? 0;
      commitStats.deletions += t?.deletions ?? 0;
    });

    return commitStats;
  });

  const insertions = allCommitStats.reduce((sum, item) => {
    return sum + item.insertions;
  }, 0);
  const deletions = allCommitStats.reduce((sum, item) => {
    return sum + item.deletions;
  }, 0);

  return {
    insertions,
    deletions,
  };
}

type RepoStats = {
  commitData: AuthorCommits[];
  teamAuthorData: TeamAuthorData;
  teamCommitData: TeamCommitData;
  fileCount: FileCount;
  linesOfCode: LinesOfCode;
  longestFiles: LongestFiles;
  authorCommitsOverTime: AuthorCommitsOverTime;
  teamCommitsForYear: number;
  teamChangedLinesForYear: LineChangeStat;
};

async function upsertRepo(repo: Repo, stats: RepoStats) {
  console.log("Upserting git commit stats...");

  const now = new Date(Date.now());
  const repoRecap: RepoRecap = {
    version: 1,
    allTimeAuthorCommits: stats.commitData,
    newAuthors: stats.teamAuthorData,
    teamCommits: stats.teamCommitData,
    fileCount: stats.fileCount,
    linesOfCode: stats.linesOfCode,
    longestFiles: stats.longestFiles,
    authorCommitsOverTime: stats.authorCommitsOverTime,
    teamCommitsForYear: stats.teamCommitsForYear,
    teamChangedLinesForYear: stats.teamChangedLinesForYear,
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

    try {
      console.log("\n\n\n==== REPO:", repo.name, " ====\n");

      await gitPullRepo(repo.path);
      const commitData = await getCommitsByAuthor(repo);
      const teamAuthorData = await getTeamAuthorCounts(repo);
      const teamCommitData = await getTeamCommitCount(repo);
      const fileCount = await getFileCount(repo);
      const linesOfCode = await getLinesOfCode(repo);
      const longestFiles = await getLongestFiles(repo);
      const authorCommitsOverTime = await getAuthorCommitsOverTime(repo);
      const teamCommitsForYear = await getTeamCommitsForYear(repo);
      const teamChangedLinesForYear = await getTeamChangedLinesForYear(repo);

      await upsertRepo(repo, {
        commitData,
        teamAuthorData,
        teamCommitData,
        fileCount,
        linesOfCode,
        longestFiles,
        authorCommitsOverTime,
        teamCommitsForYear,
        teamChangedLinesForYear,
      });
    } catch (e) {
      console.log(`\nERROR HAPPENED ON ${repo.name}\n`);
      console.error(e);
    }
  }

  console.log("\n\nDone!");
}

export default task;
