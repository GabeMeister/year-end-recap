"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoFileList = exports.getPrintFilesCmd = void 0;
const shell_1 = require("./shell");
function getPrintFilesCmd(includeFiles, excludeDirs) {
    const excludeDirStr = "\\( " + excludeDirs.map((d) => `-name "${d}"`).join(" -o ") + " \\)";
    const includeFileStr = "\\( " + includeFiles.map((f) => `-name "*.${f}"`).join(" -o ") + " \\)";
    return `find . ${excludeDirStr} -prune -o ${includeFileStr} -print | sed 's/.\\///'`;
}
exports.getPrintFilesCmd = getPrintFilesCmd;
function getRepoFileList(path, includeFiles, excludeDirs) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = getPrintFilesCmd(includeFiles, excludeDirs);
        const output = yield (0, shell_1.runExec)(cmd, {
            cwd: path,
        });
        const allFiles = output.split("\n");
        // Remove any empty strings because of ending newline
        return allFiles.filter((f) => !!f);
    });
}
exports.getRepoFileList = getRepoFileList;
