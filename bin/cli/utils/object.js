"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
function clone(o) {
    return JSON.parse(JSON.stringify(o));
}
exports.clone = clone;
