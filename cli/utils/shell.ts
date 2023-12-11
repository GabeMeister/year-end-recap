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
        maxBuffer: 1024 * 1024 * 1024,
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

export async function runExecSafe(cmd: string, options?: ExecOptions) {
  try {
    return await runExec(cmd, options);
  } catch (e) {
    console.log(
      `Error occurred while running '${cmd}': ${(e as Error).toString()}`
    );
    return "";
  }
}
