import { runExec } from "../utils/shell";

const FRONTEND_DIR = "/home/gabe/dev/rb-frontend";
const BACKEND_DIR = "/home/gabe/dev/rb-backend";
const REACT_DIR = "/home/gabe/dev/react";
const NEXT_JS_DIR = "/home/gabe/dev/next.js";
const VUE_JS_DIR = "/home/gabe/dev/vue";
const TENSORFLOW_DIR = "/home/gabe/dev/tensorflow";

const ALL_REPOS = [
  FRONTEND_DIR,
  BACKEND_DIR,
  REACT_DIR,
  NEXT_JS_DIR,
  VUE_JS_DIR,
  TENSORFLOW_DIR,
];

export type AuthorCommits = {
  commits: number;
  name: string;
};

async function calculateGitStats(repo: string): Promise<AuthorCommits[]> {
  const output = await runExec(
    `mergestat 'SELECT author_name as name, count(*) as commits
      FROM commits GROUP BY name 
      HAVING commits > 10
      ORDER BY commits desc;' -f json`,
    {
      cwd: repo,
    }
  );
  const repoStats: AuthorCommits[] = JSON.parse(output);

  return repoStats;
}

async function task() {
  for (let i = 0; i < ALL_REPOS.length; i++) {
    const repo = ALL_REPOS[i];
    const stats = await calculateGitStats(repo);
    console.log(`\n\n***** ${repo} *****\n`, stats, "\n\n");
  }
}

export default task;
