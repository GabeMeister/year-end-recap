export type Repo = {
  name: string;
  url: string;
  path: string;
  sshCloneUrl: string;
  host: "github" | "gitlab";
  // Key (duplicate) -> Value (actual)
  duplicateAuthors: Record<string, string>;
  includeFiles: string[];
  excludeDirs: string[];
  masterBranch: string;
  masterMergeSnippet: string;
  testFunctions: string[];
};

const repos: Repo[] = [
  {
    name: "RedBalloon Frontend",
    url: "https://gitlab.redballoon.dev/frontend/rb-frontend",
    path: "/home/gabe/dev/rb-frontend",
    sshCloneUrl: "https://gitlab.redballoon.dev/frontend/rb-frontend.git",
    host: "gitlab",
    duplicateAuthors: {
      "Calvin Freitas": "Cal Freitas",
      Isaac: "Isaac Neace",
      "Kenny Kline": "Kenny",
      EzraYoungren: "Ezra Youngren",
      "Stephen Bremer": "Steve Bremer",
    },
    includeFiles: ["ts", "tsx", "js", "jsx"],
    excludeDirs: ["node_modules", ".next"],
    masterBranch: "master",
    masterMergeSnippet: "%into ''master''%",
    testFunctions: ["it(", "test("],
  },
  {
    name: "RedBalloon Backend",
    url: "https://gitlab.redballoon.dev/backend/rb-backend",
    path: "/home/gabe/dev/rb-backend",
    sshCloneUrl:
      "ssh://git@ssh.gitlab.redballoon.dev:9022/backend/rb-backend.git",
    host: "gitlab",
    duplicateAuthors: {
      "Stephen Bremer": "Steve Bremer",
      "Kenny Kline": "Kenny",
    },
    includeFiles: ["ts", "js", "yml"],
    excludeDirs: ["node_modules"],
    masterBranch: "master",
    masterMergeSnippet: "%into ''master''%",
    testFunctions: ["it("],
  },
  // {
  //   name: "Next.js",
  //   url: "https://github.com/vercel/next.js",
  //   path: "/home/gabe/dev/next.js",
  //   sshCloneUrl: "git@github.com:vercel/next.js.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["ts", "tsx", "js", "jsx"],
  //   excludeDirs: ["node_modules", "packages", ".next"],
  //   masterBranch: "canary",
  //   masterMergeSnippet: "%-canary.%",
  //   testFunctions: ["it("],
  // },
  // {
  //   name: "jQuery",
  //   url: "https://github.com/jquery/jquery",
  //   path: "/home/gabe/dev/jquery",
  //   sshCloneUrl: "git@github.com:jquery/jquery.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js", "html"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "%Released%",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Vue.js 2",
  //   url: "https://github.com/vuejs/vue",
  //   path: "/home/gabe/dev/vue",
  //   sshCloneUrl: "git@github.com:vuejs/vue.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["ts", "js"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "release:",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Vue.js 3",
  //   url: "https://github.com/vuejs/core",
  //   path: "/home/gabe/dev/core",
  //   sshCloneUrl: "git@github.com:vuejs/core.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["ts", "js"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "release:",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Prettier",
  //   url: "https://github.com/prettier/prettier",
  //   path: "/home/gabe/dev/prettier",
  //   sshCloneUrl: "git@github.com:prettier/prettier.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js", "ts", "html", "css", "scss"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "Release",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Express.js",
  //   url: "https://github.com/expressjs/express",
  //   path: "/home/gabe/dev/express",
  //   sshCloneUrl: "git@github.com:expressjs/express.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "master",
  //   masterMergeSnippet: "4.",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Webpack",
  //   url: "https://github.com/webpack/webpack",
  //   path: "/home/gabe/dev/webpack",
  //   sshCloneUrl: "git@github.com:webpack/webpack.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "5.",
  //   testFunctions: ["it(", "test("],
  // },
  {
    name: "Lodash",
    url: "https://github.com/lodash/lodash",
    path: "/home/gabe/dev/lodash",
    sshCloneUrl: "git@github.com:lodash/lodash.git",
    host: "github",
    duplicateAuthors: {},
    includeFiles: ["js", "ts"],
    excludeDirs: ["node_modules"],
    masterBranch: "main",
    masterMergeSnippet: "Bump to",
    testFunctions: ["it(", "test("],
  },

  /*
   * EXTREMELY LONG REPOS
   */

  // {
  //   name: "TypeScript",
  //   url: "https://github.com/microsoft/TypeScript",
  //   path: "/home/gabe/dev/TypeScript",
  //   sshCloneUrl: "git@github.com:microsoft/TypeScript.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js", "ts"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "Update LKG",
  //   testFunctions: ["it(", "test("],
  // },
  // {
  //   name: "Electron",
  //   url: "https://github.com/electron/electron",
  //   path: "/home/gabe/dev/electron",
  //   sshCloneUrl: "git@github.com:electron/electron.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["js", "cpp", "c", "mm", "h", "ts"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "main",
  //   masterMergeSnippet: "electron v",
  //   testFunctions: ["it(", "test("],
  // },
];

/*
 * TEMPLATE
 */

// {
//   name: "",
//   url: "",
//   path: "",
//   sshCloneUrl: "",
//   host: "",
//   duplicateAuthors: {},
//   includeFiles: [],
//   excludeDirs: ["node_modules"],
//   masterBranch: "",
//   masterMergeSnippet: "",
//   testFunctions: ["it(", "test("],
// },

export default repos;
