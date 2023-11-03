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
    testFunctions: ["it(", "test("],
  },
  // {
  //   name: "RedBalloon Backend",
  //   url: "https://gitlab.redballoon.dev/backend/rb-backend",
  //   path: "/home/gabe/dev/rb-backend",
  //   sshCloneUrl:
  //     "ssh://git@ssh.gitlab.redballoon.dev:9022/backend/rb-backend.git",
  //   host: "gitlab",
  //   duplicateAuthors: {
  //     "Stephen Bremer": "Steve Bremer",
  //     "Kenny Kline": "Kenny",
  //   },
  //   includeFiles: ["ts", "js", "yml"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "master",
  //   testFunctions: ["it("],
  // },
  // {
  //   name: "Next.js",
  //   url: "https://github.com/vercel/next.js",
  //   path: "/home/gabe/dev/next.js",
  //   sshCloneUrl: "git@github.com:vercel/next.js.git",
  //   host: "github",
  //   duplicateAuthors: {},
  //   includeFiles: ["ts", "tsx", "js", "jsx"],
  //   excludeDirs: ["node_modules"],
  //   masterBranch: "canary",
  //   testFunctions: ["it("],
  // },
];

export default repos;
