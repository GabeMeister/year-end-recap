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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangesFromGitLogStr = exports.getGitAuthorSummary = exports.getGitAuthorCommits = exports.getAuthorName = exports.getHost = void 0;
const execa_1 = __importDefault(require("execa"));
const constants_1 = require("./constants");
function getHost(repoUrl) {
    return repoUrl.includes("github") ? "github" : "gitlab";
}
exports.getHost = getHost;
function getAuthorName(name) {
    var _a;
    return (_a = constants_1.DUPLICATE_GIT_AUTHOR_NAME_MAP[name]) !== null && _a !== void 0 ? _a : name;
}
exports.getAuthorName = getAuthorName;
function getGitAuthorCommits(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield (0, execa_1.default)("mergestat", [
            "SELECT author_name as name, author_when as date, message FROM commits order by author_when",
            "-f",
            "json",
        ], {
            cwd: repo,
        });
        const commits = JSON.parse(stdout);
        return commits;
    });
}
exports.getGitAuthorCommits = getGitAuthorCommits;
function getGitAuthorSummary(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield (0, execa_1.default)("mergestat", [
            "SELECT author_name as name, count(*) as commits FROM commits group by name order by commits desc;",
            "-f",
            "json",
        ], {
            cwd: repo,
        });
        const data = JSON.parse(stdout);
        const summaryData = data.reduce((result, item) => {
            const authorName = getAuthorName(item.name);
            if (result.hasOwnProperty(authorName)) {
                result[authorName] += item.commits;
            }
            else {
                result[authorName] = item.commits;
            }
            return result;
        }, {});
        return summaryData;
    });
}
exports.getGitAuthorSummary = getGitAuthorSummary;
function getChangesFromGitLogStr(line) {
    const stats = line
        .trim()
        .split(",")
        .map((part) => {
        part = part.trim();
        if (part.includes("files changed") || part.includes("file changed")) {
            const count = parseInt(part.replace(" files changed", "").replace(" file changed", ""));
            return { filesChanged: count };
        }
        else if (part.includes("insertions") || part.includes("insertion")) {
            const count = parseInt(part.replace(" insertions(+)", "").replace(" insertion(+)", ""));
            return { insertions: count };
        }
        else if (part.includes("deletions") || part.includes("deletion")) {
            const count = parseInt(part.replace(" deletions(-)", "").replace(" deletion(-)", ""));
            return { deletions: count };
        }
        else {
            throw new Error(`Unrecognized part from git log string: ${part}`);
        }
    });
    const commitStats = {
        filesChanged: 0,
        insertions: 0,
        deletions: 0,
    };
    stats.forEach((stat) => {
        for (const [key, value] of Object.entries(stat)) {
            commitStats[key] += value;
        }
    });
    return commitStats;
}
exports.getChangesFromGitLogStr = getChangesFromGitLogStr;
