import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { execa } from "execa";

const options: Partial<SimpleGitOptions> = {
  baseDir: "/home/gabe/dev/rb-frontend",
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

async function main() {
  // const data = await git.log();
  // console.log("\n\n***** data *****\n", data, "\n\n");

  const { stdout } = await execa(
    "mergestat",
    [
      "SELECT author_name, count(*) as num_commits FROM commits group by author_name order by num_commits desc",
      "-f",
      "json",
    ],
    {
      cwd: "/home/gabe/dev/rb-frontend",
    }
  );
  console.log(stdout);
}

main();
