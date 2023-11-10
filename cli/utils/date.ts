import { format, startOfYear, endOfYear } from "date-fns";

export function getUnixTimeAtMidnight(dateStr: string): number {
  return new Date(dateStr).setHours(0, 0, 0, 0);
}

export function getDateAtMidnight(dateStr: string): Date {
  return new Date(new Date(dateStr).setHours(0, 0, 0, 0));
}

export function getFirstDayOfYear(): Date {
  const now = new Date(Date.now());
  const firstDay = startOfYear(now);

  return firstDay;
}

export function getLastDayOfYear(): Date {
  const now = new Date(Date.now());
  const lastDay = endOfYear(now);

  return lastDay;
}

// Return 2023-01-01
export function getFirstDayOfYearStr(): string {
  return format(getFirstDayOfYear(), "yyyy-MM-dd");
}

export function getLastDayOfYearStr(): string {
  return format(getLastDayOfYear(), "yyyy-MM-dd");
}

export function getDateStr(d: Date, formatStr: string = "yyyy-MM-dd"): string {
  return format(d, formatStr);
}

export function createDateMap<T>() {
  const entries: Record<number, T> = {};

  function get(d: Date): T | null {
    return entries[d.getTime()] ?? null;
  }

  function set(key: Date, value: T) {
    entries[key.getTime()] = value;
  }

  function has(key: Date) {
    return key.getTime() in entries;
  }

  function del(key: Date) {
    delete entries[key.getTime()];
  }

  function all(): [Date, T][] {
    const final: [Date, T][] = Object.keys(entries).map((k) => {
      const d = new Date(parseInt(k));

      return [d, entries[k]];
    });

    return final;
  }

  function toString(): string {
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

// NOTE: this is 1-based
export function getMonthDisplayName(month: number): string {
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

  return map[month] ?? "";
}

// NOTE: this is 0-based (0 is Sunday)
export function getWeekdayDisplayName(weekday: number): string {
  const map = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  return map[weekday] ?? "";
}

// NOTE: this is 0 based
export function getHourDisplayName(hour: number): string {
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

  return map[hour] ?? "";
}
