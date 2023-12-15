"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const commander_1 = require("commander");
const date_1 = require("../utils/date");
const lodash_2 = require("lodash");
const shell_1 = require("../utils/shell");
const repos_1 = __importDefault(require("../data/repos"));
const client_1 = __importDefault(require("../../src/db/client"));
const date_2 = require("../utils/date");
const git_1 = require("../utils/git");
const object_1 = require("../utils/object");
const files_1 = require("../utils/files");
const fs_1 = __importDefault(require("fs"));
function getAuthorName(name, duplicateAuthors) {
    if (name in duplicateAuthors) {
        return duplicateAuthors[name];
    }
    else {
        return name;
    }
}
function checkForDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        // mergestat
        // git
        // find
        // npx
        return true;
    });
}
function gitPullRepo(path) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Pulling repo...");
        yield (0, shell_1.runExec)("git pull", {
            cwd: path,
        });
    });
}
function getCommitsByAuthor(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting commits by author...");
        const output = yield (0, shell_1.runExec)(`mergestat 'SELECT author_name as name, count(*) as commits
      FROM commits GROUP BY name
      HAVING commits > 1
      ORDER BY commits desc;' -f json`, {
            cwd: repo.path,
        });
        const authorCommits = JSON.parse(output);
        const authorNameMap = {};
        authorCommits.forEach((author) => {
            const realName = getAuthorName(author.name, repo.duplicateAuthors);
            if (realName in authorNameMap) {
                authorNameMap[realName] += author.commits;
            }
            else {
                authorNameMap[realName] = author.commits;
            }
        });
        const final = [];
        Object.keys(authorNameMap).forEach((name) => {
            final.push({
                name,
                commits: authorNameMap[name],
            });
        });
        final.sort((a, b) => {
            if (a.commits > b.commits) {
                return -1;
            }
            else if (a.commits < b.commits) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return final;
    });
}
function getAuthorFirstCommits(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = yield (0, shell_1.runExec)(`mergestat 'select author_name as name, min(author_when) as first_commit from commits group by author_name;' -f json`, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout);
        const authorFirstCommits = {};
        output.forEach((a) => {
            const realName = getAuthorName(a.name, repo.duplicateAuthors);
            const firstCommitDate = new Date(a.first_commit);
            if (realName in authorFirstCommits &&
                firstCommitDate < authorFirstCommits[realName]) {
                authorFirstCommits[realName] = firstCommitDate;
            }
            else if (!(realName in authorFirstCommits)) {
                authorFirstCommits[realName] = firstCommitDate;
            }
        });
        return authorFirstCommits;
    });
}
function getTeamAuthorCounts(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team size...");
        const authorFirstCommits = yield getAuthorFirstCommits(repo);
        const now = new Date(Date.now());
        const beginningOfYear = new Date(now.getFullYear(), 0, 1);
        const prevYearFirstCommits = (0, lodash_1.pickBy)(authorFirstCommits, (v) => {
            return v < beginningOfYear;
        });
        const currYearFirstCommits = (0, lodash_1.pickBy)(authorFirstCommits, (v) => {
            return v >= beginningOfYear;
        });
        const newAuthors = [];
        for (let [k, v] of Object.entries(currYearFirstCommits)) {
            newAuthors.push({
                name: k,
                first_commit: v,
            });
        }
        newAuthors.sort((a, b) => {
            if (a.first_commit > b.first_commit) {
                return -1;
            }
            else {
                return 1;
            }
        });
        return {
            previousYearCount: Object.keys(prevYearFirstCommits).length,
            currentYearCount: Object.keys(authorFirstCommits).length,
            newAuthors,
        };
    });
}
function getTeamCommitCount(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team-wide commit totals...");
        const now = new Date(Date.now());
        const stdout1 = yield (0, shell_1.runExec)(`mergestat "select count(*) as count from commits where author_when < '${now.getFullYear()}-01-01'" -f json`, {
            cwd: repo.path,
        });
        const prevYear = JSON.parse(stdout1)[0];
        const stdout2 = yield (0, shell_1.runExec)(`mergestat "select count(*) as count from commits where author_when >= '${now.getFullYear()}-01-01'" -f json`, {
            cwd: repo.path,
        });
        const currYear = JSON.parse(stdout2)[0];
        return {
            prevYear: prevYear.count,
            currYear: prevYear.count + currYear.count,
        };
    });
}
function getLastCommitFromPrevYear(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstDayOfYear = (0, date_2.getFirstDayOfYearStr)();
        let stdout = yield (0, shell_1.runExec)(`mergestat "select hash, max(author_when) as last_commit from commits where author_when < '${firstDayOfYear}';" -f json`, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout)[0];
        return output.hash;
    });
}
function getFileCount(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting file counts...");
        const excludeDirStr = "\\( " + repo.excludeDirs.map((d) => `-name "${d}"`).join(" -o ") + " \\)";
        const includeFileStr = "\\( " +
            repo.includeFiles.map((f) => `-name "*.${f}"`).join(" -o ") +
            " \\)";
        const cmd1 = `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | wc -l`;
        const stdout1 = yield (0, shell_1.runExec)(cmd1, {
            cwd: repo.path,
        });
        const currYear = JSON.parse(stdout1);
        const finalPrevYearCommit = yield getLastCommitFromPrevYear(repo);
        console.log(`Checking out repo to commit ${finalPrevYearCommit}...`);
        yield (0, shell_1.runExec)(`git checkout ${finalPrevYearCommit}`, {
            cwd: repo.path,
        });
        const cmd2 = `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | wc -l`;
        const stdout2 = yield (0, shell_1.runExec)(cmd2, {
            cwd: repo.path,
        });
        const prevYear = JSON.parse(stdout2);
        console.log(`Checking out repo to master...`);
        yield (0, shell_1.runExec)(`git checkout ${repo.masterBranch}`, {
            cwd: repo.path,
        });
        return {
            prevYear,
            currYear,
        };
    });
}
function getLinesOfCode(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting lines of code...");
        const excludeDirStr = repo.excludeDirs.join(",");
        const includeFileStr = repo.includeFiles.join(",");
        const cmd1 = `npx cloc . --include-ext=${includeFileStr} --exclude-dir=${excludeDirStr} --json`;
        const stdout1 = yield (0, shell_1.runExec)(cmd1, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout1);
        const finalPrevYearCommit = yield getLastCommitFromPrevYear(repo);
        console.log(`Checking out repo to commit ${finalPrevYearCommit}...`);
        yield (0, shell_1.runExec)(`git checkout ${finalPrevYearCommit}`, {
            cwd: repo.path,
        });
        const stdout2 = yield (0, shell_1.runExec)(cmd1, {
            cwd: repo.path,
        });
        const output2 = JSON.parse(stdout2);
        console.log(`Checking out repo to master...`);
        yield (0, shell_1.runExec)(`git checkout ${repo.masterBranch}`, {
            cwd: repo.path,
        });
        return {
            prevYear: output2.SUM.blank + output2.SUM.code + output2.SUM.comment,
            currYear: output.SUM.blank + output.SUM.code + output.SUM.comment,
        };
    });
}
function getLongestFiles(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting longest files...");
        const includeFileStr = repo.includeFiles.map((f) => `'*.${f}'`).join(" ");
        const printFilesCmd = (0, files_1.getPrintFilesCmd)(repo.includeFiles, repo.excludeDirs);
        const cmd1 = `${printFilesCmd} | sed 's/.*/"&"/' | xargs wc -l | sort -rh | grep -v ' total' | head -n 3`;
        const stdout1 = yield (0, shell_1.runExec)(cmd1, {
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
    });
}
function getGitAuthorCommits(repo, authorsToInclude) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorSqlStr = authorsToInclude.map((a) => `'${a}'`).join(",");
        const stdout = yield (0, shell_1.runExec)(`mergestat "SELECT author_name as name, author_when as date FROM commits where author_name in (${authorSqlStr}) order by author_when" -f json`, {
            cwd: repo,
        });
        const commits = JSON.parse(stdout);
        return commits;
    });
}
function getTopAuthors(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const duplicateAuthors = Object.keys(repo.duplicateAuthors)
            .map((a) => `'${a}'`)
            .join(",");
        const stdout = yield (0, shell_1.runExec)(`mergestat "SELECT author_name as name, count(*) as count
      FROM commits 
      WHERE name not in (${duplicateAuthors}) 
      GROUP BY name 
      ORDER BY count desc" -f json`, {
            cwd: repo.path,
        });
        const authorCommits = JSON.parse(stdout);
        // Some repos (like Next.js) have over 3,000 contributors. So we just pick the top 20.
        const final = authorCommits.slice(0, 20).map((a) => a.name);
        return final;
    });
}
function getAuthorCommitsOverTime(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting author commits over time...");
        const topAuthors = yield getTopAuthors(repo);
        const commits = yield getGitAuthorCommits(repo.path, topAuthors);
        const allAuthors = (0, lodash_2.uniqBy)(commits.map((c) => c.name), (c) => c);
        const allDates = (0, lodash_2.uniqBy)(commits.map((c) => {
            return (0, date_2.getUnixTimeAtMidnight)(c.date);
        }), (d) => d).map((d) => new Date(d));
        const authorToCommitMap = {};
        allAuthors.forEach((a) => {
            authorToCommitMap[getAuthorName(a, repo.duplicateAuthors)] = 0;
        });
        // INITIALIZE THE BIG [Date] -> {AUTHOR/COMMIT MAP}
        const dateToAuthorCommits = (0, date_1.createDateMap)();
        allDates.forEach((d) => {
            const map = (0, object_1.clone)(authorToCommitMap);
            dateToAuthorCommits.set(d, map);
        });
        commits.forEach((c) => {
            const d = dateToAuthorCommits.get((0, date_2.getDateAtMidnight)(c.date));
            if (!d) {
                throw new Error(`Unrecognized commit date for ${JSON.stringify(d)}`);
            }
            d[getAuthorName(c.name, repo.duplicateAuthors)]++;
        });
        const cumulativeCommits = [];
        const cumulativeAuthorCommitMap = (0, object_1.clone)(authorToCommitMap);
        for (let [k, v] of dateToAuthorCommits.all()) {
            for (let [name, numCommits] of Object.entries(v)) {
                cumulativeCommits.push({
                    date: k.toISOString(),
                    name,
                    value: cumulativeAuthorCommitMap[getAuthorName(name, repo.duplicateAuthors)],
                });
                cumulativeAuthorCommitMap[getAuthorName(name, repo.duplicateAuthors)] +=
                    numCommits;
            }
        }
        const firstDayOfYear = (0, date_1.getFirstDayOfYear)();
        return cumulativeCommits.filter((c) => {
            return new Date(c.date) >= firstDayOfYear;
        });
    });
}
function getTeamCommitsForYear(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team commits for year...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
        const stdout = yield (0, shell_1.runExec)(`mergestat "SELECT count(*) as count FROM commits where author_when > '${firstDayStr}'" -f json`, {
            cwd: repo.path,
        });
        const count = JSON.parse(stdout)[0].count;
        return count;
    });
}
function getTeamChangedLinesForYear(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team changed lines for year...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
        const lastDayStr = (0, date_1.getLastDayOfYearStr)();
        const stdout = yield (0, shell_1.runExec)(`git log --since="${firstDayStr}" --until="${lastDayStr}" --stat | grep -E "insertions|deletions"`, {
            cwd: repo.path,
        });
        const allCommitStats = stdout.split("\n").map((l) => {
            const tokens = l
                .trim()
                .split(",")
                .map((part) => {
                part = part.trim();
                if (part.includes("files changed") || part.includes("file changed")) {
                    const count = parseInt(part.replace(" files changed", "").replace(" file changed", ""));
                    return { filesChanged: count };
                }
                else if (part.includes("insertions") || part.includes("insertion")) {
                    const count = parseInt(part.replace(" insertions(+)", "").replace(" insertion(+)", ""));
                    return { insertions: count };
                }
                else if (part.includes("deletions") || part.includes("deletion")) {
                    const count = parseInt(part.replace(" deletions(-)", "").replace(" deletion(-)", ""));
                    return { deletions: count };
                }
            });
            const commitStats = {
                filesChanged: 0,
                insertions: 0,
                deletions: 0,
            };
            tokens.forEach((t) => {
                var _a, _b, _c;
                commitStats.filesChanged += (_a = t === null || t === void 0 ? void 0 : t.filesChanged) !== null && _a !== void 0 ? _a : 0;
                commitStats.insertions += (_b = t === null || t === void 0 ? void 0 : t.insertions) !== null && _b !== void 0 ? _b : 0;
                commitStats.deletions += (_c = t === null || t === void 0 ? void 0 : t.deletions) !== null && _c !== void 0 ? _c : 0;
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
    });
}
function getTeamCommitsByMonth(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team overall commits by month...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
        const cmd = `mergestat "
        select
          strftime('%m', author_when) as month,
          count(*) as commits
        from commits
        where author_when >= '${firstDayStr}'
        group by month order by month;" -f json`;
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout);
        const final = [];
        for (let i = 0; i < output.length; i++) {
            const data = output[i];
            final.push({
                commits: data.commits,
                month: (0, date_1.getMonthDisplayName)(parseInt(data.month)),
            });
        }
        return final;
    });
}
function getTeamCommitsByWeekDay(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team overall commits by week day...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
        const cmd = `mergestat "
        select
          strftime('%w', author_when) as weekday,
          count(*) as commits
        from commits
        where author_when >= '${firstDayStr}'
        group by weekday
        order by weekday;" -f json`;
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout);
        const final = [];
        for (let i = 0; i < output.length; i++) {
            const data = output[i];
            final.push({
                commits: data.commits,
                weekday: (0, date_1.getWeekdayDisplayName)(parseInt(data.weekday)),
            });
        }
        return final;
    });
}
function getTeamCommitsByHour(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting team overall commits by hour...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout);
        const final = [];
        for (let i = 0; i < output.length; i++) {
            const data = output[i];
            final.push({
                commits: data.commits,
                hour: (0, date_1.getHourDisplayName)(parseInt(data.hour)),
            });
        }
        return final;
    });
}
function getHighestCommitDayByAuthor(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting highest commit day by author...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        const output = JSON.parse(stdout);
        const highestCommitDay = output[0];
        const dateStr = (0, date_1.getDateStr)((0, date_1.convertDateToUTC)(new Date(highestCommitDay.date)));
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
        const stdout2 = yield (0, shell_1.runExec)(cmd2, {
            cwd: repo.path,
        });
        const output2 = JSON.parse(stdout2);
        return {
            authorName: highestCommitDay.author_name,
            count: highestCommitDay.count,
            date: highestCommitDay.date,
            commitMessages: output2.map((c) => ({
                hash: c.hash,
                message: c.message,
            })),
        };
    });
}
// Skipping for now, now as useful as I originally thought
function getMostChangesInDayByAuthor(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting most changes in a day by author...");
        const firstDayStr = (0, date_2.getFirstDayOfYearStr)();
        const lastDay = (0, date_1.getLastDayOfYearStr)();
        const cmd = `git log --pretty=format:'BEGIN|{ "hash": "%h", "author_name": "%an", "date": "%ad"}' --date=short --since=${firstDayStr} --until=${lastDay} --shortstat --no-merges`;
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        // 'BEGIN|{ "hash": "fe99b53d7f", "author_name": "Josh Story", "date": "2023-11-07"}',
        // ' 53 files changed, 9380 insertions(+), 4566 deletions(-)',
        const lines = stdout.split("\n").filter((l) => !!l);
        let current = {
            hash: "",
            author_name: "",
            date: "",
            insertions: 0,
            deletions: 0,
            filesChanged: 0,
        };
        const lineChangesByCommit = [];
        lines.forEach((line) => {
            if (line.startsWith("BEGIN")) {
                const jsonStr = line.split("|")[1];
                current = JSON.parse(jsonStr);
            }
            else {
                const commitStats = (0, git_1.getChangesFromGitLogStr)(line);
                lineChangesByCommit.push(Object.assign(Object.assign({}, current), commitStats));
            }
        });
        const mostChanges = lineChangesByCommit.reduce((acc, commit) => {
            if (commit.insertions + commit.deletions >
                acc.insertions + acc.deletions) {
                return commit;
            }
            else {
                return acc;
            }
        });
        console.log("\n\n***** mostChanges *****\n", mostChanges, "\n\n");
        return {
            authorName: "",
            insertions: 5,
            deletions: 5,
            date: "",
        };
    });
}
function getLongestCommit(repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        return JSON.parse(stdout)[0];
    });
}
function getShortestCommits(repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        return JSON.parse(stdout);
    });
}
function getCommitMessageLengths(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting commit message lengths...");
        const cmd = `
      mergestat "
        select
          length(message) - 1 as length,
          count(*) as frequency
        from commits
        group by length
        order by length desc;" -f json`;
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        return JSON.parse(stdout);
    });
}
function getAvgReleasesPerDay(repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        return JSON.parse(stdout)[0];
    });
}
function getMostReleasesInDay(repo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const stdout = yield (0, shell_1.runExec)(cmd, {
            cwd: repo.path,
        });
        return JSON.parse(stdout)[0];
    });
}
function getAuthorBlameCount(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield (0, files_1.getRepoFileList)(repo.path, repo.includeFiles, repo.excludeDirs);
        const authorBlameCountMap = {};
        for (let i = 0; i < allFiles.length; i++) {
            if (i % 50 === 0) {
                console.log(`Processing file #${i} / ${allFiles.length}`);
            }
            const file = allFiles[i];
            try {
                const blameOutput = yield (0, shell_1.runExec)(`git blame ${file} --line-porcelain`, {
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
                    }
                    else {
                        authorBlameCountMap[realName] = 1;
                    }
                });
            }
            catch (e) {
                console.log(`Error occurred on ${file}`, e.message);
            }
        }
        let authorBlames = [];
        Object.keys(authorBlameCountMap).forEach((name) => {
            authorBlames.push({
                name,
                lineCount: authorBlameCountMap[name],
            });
        });
        authorBlames = [...authorBlames].sort((a, b) => b.lineCount - a.lineCount);
        return authorBlames;
    });
}
function upsertRepo(repo, stats) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Upserting git commit stats...");
        const now = new Date(Date.now());
        const repoRecap = {
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
        const id = yield client_1.default
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
            .onConflict((oc) => oc.column("url").doUpdateSet({
            updated_date: now,
            duplicate_authors: repo.duplicateAuthors,
            data: repoRecap,
        }))
            .returning(["id"])
            .execute();
        return id;
    });
}
function getCliArgs() {
    commander_1.program.description("An application for generating your Year End Recap data.");
    commander_1.program.option("-g, --generate", "Generate blank config file for repo (will save to ./yer.json)");
    commander_1.program.parse();
    return commander_1.program.opts();
}
function task() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = getCliArgs();
            if (args.generate) {
                let config = {
                    name: "My Example Repo",
                    url: "https://github.com/supercoder99/my-repo",
                    path: "/directory/path/to/my/repo",
                    sshCloneUrl: "git@github.com:supercoder99/my-repo.git",
                    host: "github",
                    duplicateAuthors: {
                        Bob: "Bob the Builder",
                    },
                    includeFiles: ["ts", "tsx", "js", "jsx"],
                    excludeDirs: ["node_modules", ".next"],
                    masterBranch: "master",
                    masterMergeSnippet: "%into ''master''%",
                    testFunctions: ["it(", "test("],
                };
                fs_1.default.writeFileSync("./yer.json", JSON.stringify(config, null, 2));
                console.log(`
Created a config file at:

./yer.json

Please modify the config file for the repo you
want to generate a Year End Recap for, and then run:

npx year-end-recap`);
                console.log(`\n✅ Done!`);
            }
            else {
                for (let i = 0; i < repos_1.default.length; i++) {
                    const repo = repos_1.default[i];
                    try {
                        console.log("\n\n\n==== REPO:", repo.name, " ====\n");
                        yield gitPullRepo(repo.path);
                        const commitData = yield getCommitsByAuthor(repo);
                        const teamAuthorData = yield getTeamAuthorCounts(repo);
                        const teamCommitData = yield getTeamCommitCount(repo);
                        const fileCount = yield getFileCount(repo);
                        const linesOfCode = yield getLinesOfCode(repo);
                        const longestFiles = yield getLongestFiles(repo);
                        const authorCommitsOverTime = yield getAuthorCommitsOverTime(repo);
                        const teamCommitsByMonth = yield getTeamCommitsByMonth(repo);
                        const teamCommitsByWeekDay = yield getTeamCommitsByWeekDay(repo);
                        const teamCommitsByHour = yield getTeamCommitsByHour(repo);
                        const highestCommitDayByAuthor = yield getHighestCommitDayByAuthor(repo);
                        const longestCommit = yield getLongestCommit(repo);
                        const shortestCommits = yield getShortestCommits(repo);
                        const commitMessageLengths = yield getCommitMessageLengths(repo);
                        const avgReleasesPerDay = yield getAvgReleasesPerDay(repo);
                        const mostReleasesInDay = yield getMostReleasesInDay(repo);
                        const authorBlames = yield getAuthorBlameCount(repo);
                        const id = yield upsertRepo(repo, {
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
                        console.log(`\n✅ Data uploaded!\n\nView your Year End Recap here: https://yearendrecap.com/presentation/${id[0].id}`);
                    }
                    catch (e) {
                        console.log(`\nERROR HAPPENED ON ${repo.name}\n`);
                        console.error(e);
                    }
                }
            }
        }
        catch (e) {
            console.log(`An unknown error occurred while running program: ${e}`);
        }
    });
}
exports.default = task;
