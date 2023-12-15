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
exports.runExecSafe = exports.runExec = void 0;
const { exec } = require("child_process");
function runExec(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            exec(cmd, {
                cwd: options === null || options === void 0 ? void 0 : options.cwd,
                maxBuffer: 1024 * 1024 * 1024,
            }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                resolve(stdout);
            });
        });
    });
}
exports.runExec = runExec;
function runExecSafe(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield runExec(cmd, options);
        }
        catch (e) {
            console.log(`Error occurred while running '${cmd}': ${e.toString()}`);
            return "";
        }
    });
}
exports.runExecSafe = runExecSafe;
