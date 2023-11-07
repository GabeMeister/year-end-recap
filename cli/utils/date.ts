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
