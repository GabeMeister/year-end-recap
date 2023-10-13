import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { execa } from "execa";
import { uniqBy } from "lodash";
import { AnyObject, NumberObject } from "./utils/types";
import { clone } from "./utils/object";
import * as d3 from "d3";
import { getDateAtMidnight } from "./utils/date";
import { getAuthorName } from "./utils/git";

const FRONTEND_DIR = "/home/gabe/dev/rb-frontend";
const BACKEND_DIR = "/home/gabe/dev/rb-backend";
const REACT_DIR = "/home/gabe/dev/react";
const NEXT_JS_DIR = "/home/gabe/dev/next.js";
const VUE_JS_DIR = "/home/gabe/dev/vue";
const TENSORFLOW_DIR = "/home/gabe/dev/tensorflow";

const GIT_REPO_PATH = FRONTEND_DIR;

const options: Partial<SimpleGitOptions> = {
  baseDir: GIT_REPO_PATH,
  binary: "git",
  maxConcurrentProcesses: 6,
  trimmed: false,
};

// when setting all options in a single object
const git: SimpleGit = simpleGit(options);

// Bar Chart Race Example Data
// [
//   {
//     "date": "2000-01-01T00:00:00.000Z",
//     "name": "Isaac Neace",
//     "value": 34
//   },
//   {
//     "date": "2000-01-01T00:00:00.000Z",
//     "name": "Ezra Youngren",
//     "value": 25
//   },
//   {
//     "date": "2000-01-02T00:00:00.000Z",
//     "name": "Isaac Neace",
//     "value": 48
//   },
//   {
//     "date": "2000-01-02T00:00:00.000Z",
//     "name": "Ezra Youngren",
//     "value": 50
//   },
// ]

type RawCommit = {
  name: string;
  date: string;
  message: string;
};

async function main() {
  const { stdout } = await execa(
    "mergestat",
    [
      "SELECT author_name as name, author_when as date, message FROM commits order by author_when",
      "-f",
      "json",
    ],
    {
      cwd: GIT_REPO_PATH,
    }
  );
  const commits: RawCommit[] = JSON.parse(stdout);
  const allAuthors = uniqBy(
    commits.map((c) => c.name),
    (c) => c
  );
  const allDates = uniqBy(
    commits.map((c) => {
      return getDateAtMidnight(c.date);
    }),
    (d) => d
  ).map((d) => new Date(d));

  const authorToCommitMap: NumberObject = {};
  allAuthors.forEach((a) => {
    authorToCommitMap[getAuthorName(a)] = 0;
  });

  const dateToAuthorCommits = new d3.InternMap<Date, NumberObject>();

  // INITIALIZE THE BIG COMMIT TO AUTHOR MAP
  allDates.forEach((d) => {
    const map = clone(authorToCommitMap);
    dateToAuthorCommits.set(d, map);
  });

  commits.forEach((c) => {
    const d = dateToAuthorCommits.get(getDateAtMidnight(c.date));
    if (!d) {
      throw new Error(`Unrecognized commit date for ${JSON.stringify(d)}`);
    }

    d[getAuthorName(c.name)]++;
  });

  const cumulativeCommits = [];
  const cumulativeAuthorCommitMap = clone(authorToCommitMap);
  for (let [k, v] of dateToAuthorCommits.entries()) {
    for (let [name, numCommits] of Object.entries(v)) {
      cumulativeCommits.push({
        date: k.toISOString(),
        name,
        value: cumulativeAuthorCommitMap[getAuthorName(name)],
      });

      cumulativeAuthorCommitMap[getAuthorName(name)] += numCommits;
    }
  }

  Bun.write(
    "../src/data/commits_over_time.json",
    JSON.stringify(
      cumulativeCommits.filter((c) => c.value > 10),
      null,
      2
    )
  );
}

main();
