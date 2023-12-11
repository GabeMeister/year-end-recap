import { pickBy } from "lodash";
import {
  convertDateToUTC,
  createDateMap,
  getDateStr,
  getFirstDayOfYear,
  getHourDisplayName,
  getLastDayOfYearStr,
  getMonthDisplayName,
  getWeekdayDisplayName,
} from "../utils/date";
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
  TeamCommitsByMonth,
  TeamCommitsByWeekDay,
  TeamCommitsByHour,
  HighestCommitDaySummary,
  MostChangesDaySummary,
  Commit,
  CommitMessageLength,
  AvgReleasesPerDay,
  MostReleasesInDay,
  AuthorBlameCount,
} from "../../src/types/git";
import {
  getUnixTimeAtMidnight,
  getFirstDayOfYearStr,
  getDateAtMidnight,
} from "../utils/date";
import { RawCommit, getChangesFromGitLogStr } from "../utils/git";
import { NumberObject } from "../../src/types/general";
import { clone } from "../utils/object";
import { getRepoFileList, getPrintFilesCmd } from "../utils/files";

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

async function checkForDependencies(): Promise<boolean> {
  // mergestat
  // git
  // find
  // npx

  return true;
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
  const printFilesCmd = getPrintFilesCmd(repo.includeFiles, repo.excludeDirs);
  const cmd1 = `${printFilesCmd} | sed 's/.*/"&"/' | xargs wc -l | sort -rh | grep -v ' total' | head -n 3`;
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
  const stdout = await runExec(
    `mergestat "SELECT author_name as name, author_when as date FROM commits where author_name in (${authorSqlStr}) order by author_when" -f json`,
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

  const firstDayOfYear = getFirstDayOfYear();

  return cumulativeCommits.filter((c) => {
    return new Date(c.date) >= firstDayOfYear;
  });
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

async function getTeamCommitsByMonth(repo: Repo): Promise<TeamCommitsByMonth> {
  console.log("Getting team overall commits by month...");

  const firstDayStr = getFirstDayOfYearStr();
  const cmd = `mergestat "
        select
          strftime('%m', author_when) as month,
          count(*) as commits
        from commits
        where author_when >= '${firstDayStr}'
        group by month order by month;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  type CommitsByMonth = {
    month: string;
    commits: number;
  }[];

  const output: CommitsByMonth = JSON.parse(stdout);

  const final: TeamCommitsByMonth = [];
  for (let i = 0; i < output.length; i++) {
    const data = output[i];

    final.push({
      commits: data.commits,
      month: getMonthDisplayName(parseInt(data.month)),
    });
  }

  return final;
}

async function getTeamCommitsByWeekDay(
  repo: Repo
): Promise<TeamCommitsByWeekDay> {
  console.log("Getting team overall commits by week day...");

  const firstDayStr = getFirstDayOfYearStr();
  const cmd = `mergestat "
        select
          strftime('%w', author_when) as weekday,
          count(*) as commits
        from commits
        where author_when >= '${firstDayStr}'
        group by weekday
        order by weekday;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  type CommitsByWeekDay = {
    weekday: string;
    commits: number;
  }[];

  const output: CommitsByWeekDay = JSON.parse(stdout);

  const final: CommitsByWeekDay = [];
  for (let i = 0; i < output.length; i++) {
    const data = output[i];

    final.push({
      commits: data.commits,
      weekday: getWeekdayDisplayName(parseInt(data.weekday)),
    });
  }

  return final;
}

async function getTeamCommitsByHour(repo: Repo): Promise<TeamCommitsByHour> {
  console.log("Getting team overall commits by hour...");

  const firstDayStr = getFirstDayOfYearStr();
  const cmd = `
    mergestat "
      select
        strftime('%H', datetime(author_when, 'localtime')) as hour,
        count(*) as commits
      from commits
      where author_when >= '${firstDayStr}'
      and message not like '%into ''master''%'
      group by hour
      order by hour;
    " -f json
  `;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  const output: TeamCommitsByHour = JSON.parse(stdout);

  const final: TeamCommitsByHour = [];
  for (let i = 0; i < output.length; i++) {
    const data = output[i];

    final.push({
      commits: data.commits,
      hour: getHourDisplayName(parseInt(data.hour)),
    });
  }

  return final;
}

async function getHighestCommitDayByAuthor(
  repo: Repo
): Promise<HighestCommitDaySummary> {
  console.log("Getting highest commit day by author...");

  const firstDayStr = getFirstDayOfYearStr();
  const cmd = `
    mergestat "
      select
        author_name,
        count(*) as count,
        strftime('%Y-%m-%d', datetime(author_when, 'localtime')) as date
      from commits
      where author_when > '${firstDayStr}'
      group by author_name,date
      order by count desc
      limit 1;
    " -f json
  `;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  type HighestCommitDay = {
    author_name: string;
    count: number;
    date: string;
  };

  const output: HighestCommitDay[] = JSON.parse(stdout);
  const highestCommitDay = output[0];

  const dateStr = getDateStr(convertDateToUTC(new Date(highestCommitDay.date)));
  const cmd2 = `
    mergestat "
      select
        author_name,
        hash,
        message
      from commits
      where strftime('%Y-%m-%d', datetime(author_when, 'localtime')) = '${dateStr}'
      and author_name = '${highestCommitDay.author_name}'
    " -f json
  `;

  const stdout2 = await runExec(cmd2, {
    cwd: repo.path,
  });

  type CommitList = {
    author_name: string;
    hash: string;
    message: string;
  };
  const output2: CommitList[] = JSON.parse(stdout2);

  return {
    authorName: highestCommitDay.author_name,
    count: highestCommitDay.count,
    date: highestCommitDay.date,
    commitMessages: output2.map((c) => ({
      hash: c.hash,
      message: c.message,
    })),
  };
}

// Skipping for now, now as useful as I originally thought
async function getMostChangesInDayByAuthor(
  repo: Repo
): Promise<MostChangesDaySummary> {
  console.log("Getting most changes in a day by author...");

  const firstDayStr = getFirstDayOfYearStr();
  const lastDay = getLastDayOfYearStr();
  const cmd = `git log --pretty=format:'BEGIN|{ "hash": "%h", "author_name": "%an", "date": "%ad"}' --date=short --since=${firstDayStr} --until=${lastDay} --shortstat --no-merges`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });
  // 'BEGIN|{ "hash": "fe99b53d7f", "author_name": "Josh Story", "date": "2023-11-07"}',
  // ' 53 files changed, 9380 insertions(+), 4566 deletions(-)',
  const lines = stdout.split("\n").filter((l) => !!l);
  type CommitChangeSummary = {
    hash: string;
    author_name: string;
    date: string;
    insertions: number;
    deletions: number;
    filesChanged: number;
  };
  let current: CommitChangeSummary = {
    hash: "",
    author_name: "",
    date: "",
    insertions: 0,
    deletions: 0,
    filesChanged: 0,
  };
  const lineChangesByCommit: CommitChangeSummary[] = [];

  lines.forEach((line) => {
    if (line.startsWith("BEGIN")) {
      const jsonStr = line.split("|")[1];
      current = JSON.parse(jsonStr);
    } else {
      const commitStats = getChangesFromGitLogStr(line);
      lineChangesByCommit.push({ ...current, ...commitStats });
    }
  });

  const mostChanges = lineChangesByCommit.reduce(
    (acc: CommitChangeSummary, commit: CommitChangeSummary) => {
      if (
        commit.insertions + commit.deletions >
        acc.insertions + acc.deletions
      ) {
        return commit;
      } else {
        return acc;
      }
    }
  );
  console.log("\n\n***** mostChanges *****\n", mostChanges, "\n\n");

  return {
    authorName: "",
    insertions: 5,
    deletions: 5,
    date: "",
  };
}

async function getLongestCommit(repo: Repo): Promise<Commit> {
  console.log("Getting longest commit...");

  const cmd = `
      mergestat "
        select
          hash,
          length(message) as length,
          author_name,
          message,
          author_when
        from commits
        order by length desc
        limit 1;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  return JSON.parse(stdout)[0] as Commit;
}

async function getShortestCommits(repo: Repo): Promise<Commit[]> {
  console.log("Getting shortest commits...");

  const cmd = `
      mergestat "
        select
          hash,
          length(message) as length,
          author_name,
          message,
          author_when
        from commits
        order by length
        limit 5;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  return JSON.parse(stdout) as Commit[];
}

async function getCommitMessageLengths(
  repo: Repo
): Promise<CommitMessageLength[]> {
  console.log("Getting commit message lengths...");

  const cmd = `
      mergestat "
        select
          length(message) - 1 as length,
          count(*) as frequency
        from commits
        group by length
        order by length desc;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  return JSON.parse(stdout) as CommitMessageLength[];
}

async function getAvgReleasesPerDay(repo: Repo): Promise<AvgReleasesPerDay> {
  console.log("Getting average releases per day...");

  // Divide by 260 working days per year. And it's 260.0 so it's not integer
  // math. We want the decimal.
  const cmd = `
    mergestat "
      select
        count(*) / 260.0 as count
      from commits
      where message like '%into ''master''%' and message not like '%This reverts merge request%'
      order by author_when;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  return JSON.parse(stdout)[0] as AvgReleasesPerDay;
}

async function getMostReleasesInDay(repo: Repo): Promise<MostReleasesInDay> {
  console.log("Getting most releases in a day...");

  const cmd = `
    mergestat "
      select
        strftime('%Y-%m-%d', datetime(author_when, 'localtime')) as date,
        count(*) as count
      from commits
      where message like '${repo.masterMergeSnippet}'
      group by date
      order by count desc;" -f json`;
  const stdout = await runExec(cmd, {
    cwd: repo.path,
  });

  return JSON.parse(stdout)[0] as MostReleasesInDay;
}

async function getAuthorBlameCount(repo: Repo): Promise<AuthorBlameCount[]> {
  const allFiles = await getRepoFileList(
    repo.path,
    repo.includeFiles,
    repo.excludeDirs
  );

  const authorBlameCountMap: Record<string, number> = {};

  for (let i = 0; i < allFiles.length; i++) {
    if (i % 50 === 0) {
      console.log(`Processing file #${i} / ${allFiles.length}`);
    }

    const file = allFiles[i];

    try {
      const blameOutput = await runExec(`git blame ${file} --line-porcelain`, {
        cwd: repo.path,
      });
      const authors = blameOutput
        .split("\n")
        .filter((l) => l.includes("committer "))
        .map((l) => l.replace("committer ", ""));

      authors.forEach((a) => {
        const realName = getAuthorName(a, repo.duplicateAuthors);
        if (authorBlameCountMap[realName]) {
          authorBlameCountMap[realName]++;
        } else {
          authorBlameCountMap[realName] = 1;
        }
      });
    } catch (e) {
      console.log(`Error occurred on ${file}`, (e as Error).message);
    }
  }

  let authorBlames: AuthorBlameCount[] = [];

  Object.keys(authorBlameCountMap).forEach((name) => {
    authorBlames.push({
      name,
      lineCount: authorBlameCountMap[name],
    });
  });

  authorBlames = [...authorBlames].sort((a, b) => b.lineCount - a.lineCount);

  return authorBlames;
}

type RepoStats = {
  commitData: AuthorCommits[];
  teamAuthorData: TeamAuthorData;
  teamCommitData: TeamCommitData;
  fileCount: FileCount;
  linesOfCode: LinesOfCode;
  longestFiles: LongestFiles;
  authorCommitsOverTime: AuthorCommitsOverTime;
  teamCommitsByMonth: TeamCommitsByMonth;
  teamCommitsByWeekDay: TeamCommitsByWeekDay;
  teamCommitsByHour: TeamCommitsByHour;
  highestCommitDayByAuthor: HighestCommitDaySummary;
  longestCommit: Commit;
  shortestCommits: Commit[];
  commitMessageLengths: CommitMessageLength[];
  avgReleasesPerDay: AvgReleasesPerDay;
  mostReleasesInDay: MostReleasesInDay;
  authorBlames: AuthorBlameCount[];
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
    teamCommitsByMonth: stats.teamCommitsByMonth,
    teamCommitsByWeekDay: stats.teamCommitsByWeekDay,
    teamCommitsByHour: stats.teamCommitsByHour,
    highestCommitDayByAuthor: stats.highestCommitDayByAuthor,
    longestCommit: stats.longestCommit,
    shortestCommits: stats.shortestCommits,
    commitMessageLengths: stats.commitMessageLengths,
    avgReleasesPerDay: stats.avgReleasesPerDay,
    mostReleasesInDay: stats.mostReleasesInDay,
    authorBlames: stats.authorBlames,
  };

  const id = await db
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
    .returning(["id"])
    .execute();

  return id;
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
      const teamCommitsByMonth = await getTeamCommitsByMonth(repo);
      const teamCommitsByWeekDay = await getTeamCommitsByWeekDay(repo);
      const teamCommitsByHour = await getTeamCommitsByHour(repo);
      const highestCommitDayByAuthor = await getHighestCommitDayByAuthor(repo);
      const longestCommit = await getLongestCommit(repo);
      const shortestCommits = await getShortestCommits(repo);
      const commitMessageLengths = await getCommitMessageLengths(repo);
      const avgReleasesPerDay = await getAvgReleasesPerDay(repo);
      const mostReleasesInDay = await getMostReleasesInDay(repo);
      const authorBlames = await getAuthorBlameCount(repo);

      const id = await upsertRepo(repo, {
        commitData,
        teamAuthorData,
        teamCommitData,
        fileCount,
        linesOfCode,
        longestFiles,
        authorCommitsOverTime,
        teamCommitsByMonth,
        teamCommitsByWeekDay,
        teamCommitsByHour,
        highestCommitDayByAuthor,
        longestCommit,
        shortestCommits,
        commitMessageLengths,
        avgReleasesPerDay,
        mostReleasesInDay,
        authorBlames,
      });

      console.log(
        `\n✅ Data uploaded!\n\nView your Year End Recap here: https://yearendrecap.com/presentation/${id[0].id}`
      );
    } catch (e) {
      console.log(`\nERROR HAPPENED ON ${repo.name}\n`);
      console.error(e);
    }
  }
}

export default task;
