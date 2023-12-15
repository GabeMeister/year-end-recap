"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateToUTC = exports.getHourDisplayName = exports.getWeekdayDisplayName = exports.getMonthDisplayName = exports.createDateMap = exports.getDateStr = exports.getLastDayOfYearStr = exports.getFirstDayOfYearStr = exports.getLastDayOfYear = exports.getFirstDayOfYear = exports.getDateAtMidnight = exports.getUnixTimeAtMidnight = void 0;
const date_fns_1 = require("date-fns");
function getUnixTimeAtMidnight(dateStr) {
    return new Date(dateStr).setHours(0, 0, 0, 0);
}
exports.getUnixTimeAtMidnight = getUnixTimeAtMidnight;
function getDateAtMidnight(dateStr) {
    return new Date(new Date(dateStr).setHours(0, 0, 0, 0));
}
exports.getDateAtMidnight = getDateAtMidnight;
function getFirstDayOfYear() {
    const now = new Date(Date.now());
    const firstDay = (0, date_fns_1.startOfYear)(now);
    return firstDay;
}
exports.getFirstDayOfYear = getFirstDayOfYear;
function getLastDayOfYear() {
    const now = new Date(Date.now());
    const lastDay = (0, date_fns_1.endOfYear)(now);
    return lastDay;
}
exports.getLastDayOfYear = getLastDayOfYear;
// Return 2023-01-01
function getFirstDayOfYearStr() {
    return (0, date_fns_1.format)(getFirstDayOfYear(), "yyyy-MM-dd");
}
exports.getFirstDayOfYearStr = getFirstDayOfYearStr;
function getLastDayOfYearStr() {
    return (0, date_fns_1.format)(getLastDayOfYear(), "yyyy-MM-dd");
}
exports.getLastDayOfYearStr = getLastDayOfYearStr;
function getDateStr(d, formatStr = "yyyy-MM-dd") {
    return (0, date_fns_1.format)(d, formatStr);
}
exports.getDateStr = getDateStr;
function createDateMap() {
    const entries = {};
    function get(d) {
        var _a;
        return (_a = entries[d.getTime()]) !== null && _a !== void 0 ? _a : null;
    }
    function set(key, value) {
        entries[key.getTime()] = value;
    }
    function has(key) {
        return key.getTime() in entries;
    }
    function del(key) {
        delete entries[key.getTime()];
    }
    function all() {
        const final = Object.keys(entries).map((k) => {
            const d = new Date(parseInt(k));
            return [d, entries[k]];
        });
        return final;
    }
    function toString() {
        return JSON.stringify(all(), null, 2);
    }
    return {
        get,
        set,
        has,
        del,
        all,
        toString,
    };
}
exports.createDateMap = createDateMap;
// NOTE: this is 1-based
function getMonthDisplayName(month) {
    var _a;
    const map = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };
    return (_a = map[month]) !== null && _a !== void 0 ? _a : "";
}
exports.getMonthDisplayName = getMonthDisplayName;
// NOTE: this is 0-based (0 is Sunday)
function getWeekdayDisplayName(weekday) {
    var _a;
    const map = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };
    return (_a = map[weekday]) !== null && _a !== void 0 ? _a : "";
}
exports.getWeekdayDisplayName = getWeekdayDisplayName;
// NOTE: this is 0 based
function getHourDisplayName(hour) {
    var _a;
    const map = {
        0: "12am",
        1: "1am",
        2: "2am",
        3: "3am",
        4: "4am",
        5: "5am",
        6: "6am",
        7: "7am",
        8: "8am",
        9: "9am",
        10: "10am",
        11: "11am",
        12: "12pm",
        13: "1pm",
        14: "2pm",
        15: "3pm",
        16: "4pm",
        17: "5pm",
        18: "6pm",
        19: "7pm",
        20: "8pm",
        21: "9pm",
        22: "10pm",
        23: "11pm",
    };
    return (_a = map[hour]) !== null && _a !== void 0 ? _a : "";
}
exports.getHourDisplayName = getHourDisplayName;
function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
exports.convertDateToUTC = convertDateToUTC;
