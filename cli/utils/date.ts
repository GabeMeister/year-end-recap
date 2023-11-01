import { format } from "date-fns";

export function getDateAtMidnight(dateStr: string): number {
  return new Date(dateStr).setHours(0, 0, 0, 0);
}

export function getFirstDayOfYear(): Date {
  const now = new Date(Date.now());

  return new Date(`${now.getFullYear()}-01-01`);
}

// Return 2023-01-01
export function getFirstDayOfYearStr(): string {
  return format(getFirstDayOfYear(), "yyyy-MM-dd");
}
