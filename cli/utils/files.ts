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
