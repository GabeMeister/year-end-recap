export type Repo = {
  name: string;
  url: string;
  path: string;
  sshCloneUrl: string;
  host: "github" | "gitlab";
};

const repos: Repo[] = [
  // {
  //   name: "RedBalloon Frontend",
  //   url: "https://gitlab.redballoon.dev/frontend/rb-frontend",
  //   path: "/home/gabe/dev/rb-frontend",
  //   sshCloneUrl: "https://gitlab.redballoon.dev/frontend/rb-frontend.git",
  //   host: "gitlab",
  // },
  // {
  //   name: "RedBalloon Backend",
  //   url: "https://gitlab.redballoon.dev/backend/rb-backend",
  //   path: "/home/gabe/dev/rb-backend",
  //   sshCloneUrl:
  //     "ssh://git@ssh.gitlab.redballoon.dev:9022/backend/rb-backend.git",
  //   host: "gitlab",
  // },
  // {
  //   name: "RedBalloon Docker Compose Env",
  //   url: "https://gitlab.redballoon.dev/devops/rb-docker",
  //   path: "/home/gabe/dev/rb-docker",
  //   sshCloneUrl:
  //     "ssh://git@ssh.gitlab.redballoon.dev:9022/devops/rb-docker.git",
  //   host: "gitlab",
  // },
  // {
  //   name: "React.js",
  //   url: "https://github.com/facebook/react",
  //   path: "/home/gabe/dev/react",
  //   sshCloneUrl: "git@github.com:facebook/react.git",
  //   host: "github",
  // },
  // {
  //   name: "Next.js",
  //   url: "https://github.com/vercel/next.js",
  //   path: "/home/gabe/dev/next.js",
  //   sshCloneUrl: "git@github.com:vercel/next.js.git",
  //   host: "github",
  // },
  // {
  //   name: "Django",
  //   url: "https://github.com/django/django",
  //   path: "/home/gabe/dev/django",
  //   sshCloneUrl: "git@github.com:django/django.git",
  //   host: "github",
  // },
  {
    name: "TailwindCss",
    url: "https://github.com/tailwindlabs/tailwindcss",
    path: "/home/gabe/dev/tailwindcss",
    sshCloneUrl: "https://github.com/tailwindlabs/tailwindcss",
    host: "github",
  },
];

export default repos;
