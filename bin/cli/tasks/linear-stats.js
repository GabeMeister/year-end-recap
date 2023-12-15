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
const sdk_1 = require("@linear/sdk");
const fs_1 = __importDefault(require("fs"));
const client = new sdk_1.LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
});
function getAllIssues() {
    return __awaiter(this, void 0, void 0, function* () {
        let issues;
        let endCursor;
        const allIssues = [];
        do {
            issues = yield client.issues({
                first: 100,
                after: endCursor,
                includeArchived: true,
            });
            issues.nodes.forEach((issue) => {
                allIssues.push(issue);
            });
            endCursor = issues.pageInfo.endCursor;
            console.log(`Pulled ${allIssues.length} issues...`);
        } while (issues.pageInfo.hasNextPage);
        fs_1.default.writeFileSync("./linear-issues.json", JSON.stringify(allIssues));
    });
}
function task() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield getAllIssues();
        }
        catch (e) {
            console.log(`\nERROR HAPPENED\n`);
            console.error(e);
        }
        console.log("\n\nDone!");
    });
}
exports.default = task;
