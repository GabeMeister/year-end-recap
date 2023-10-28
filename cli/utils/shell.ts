const { exec } = require("child_process");

type ExecOptions = {
  cwd?: string;
};

export async function runExec(cmd: string, options?: ExecOptions) {
  return new Promise<string>((resolve, reject) => {
    exec(
      cmd,
      {
        cwd: options?.cwd,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        resolve(stdout);
      }
    );
  });
}