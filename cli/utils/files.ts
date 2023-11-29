import { runExec } from "./shell";

export function getPrintFilesCmd(
  includeFiles: string[],
  excludeDirs: string[]
) {
  const excludeDirStr =
    "\\( " + excludeDirs.map((d) => `-name "${d}"`).join(" -o ") + " \\)";
  const includeFileStr =
    "\\( " + includeFiles.map((f) => `-name "*.${f}"`).join(" -o ") + " \\)";

  return `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | sed 's/.\\///'`;
}

export async function getRepoFileList(
  path: string,
  includeFiles: string[],
  excludeDirs: string[]
): Promise<string[]> {
  const cmd = getPrintFilesCmd(includeFiles, excludeDirs);
  const output = await runExec(cmd, {
    cwd: path,
  });
  const allFiles = output.split("\n");

  // Remove any empty strings because of ending newline
  return allFiles.filter((f) => !!f);
}
