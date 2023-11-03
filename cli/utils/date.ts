import { format } from "date-fns";

export function getUnixTimeAtMidnight(dateStr: string): number {
  return new Date(dateStr).setHours(0, 0, 0, 0);
}

export function getDateAtMidnight(dateStr: string): Date {
  return new Date(new Date(dateStr).setHours(0, 0, 0, 0));
}

export function getFirstDayOfYear(): Date {
  const now = new Date(Date.now());

  return new Date(`${now.getFullYear()}-01-01`);
}

// Return 2023-01-01
export function getFirstDayOfYearStr(): string {
  return format(getFirstDayOfYear(), "yyyy-MM-dd");
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
