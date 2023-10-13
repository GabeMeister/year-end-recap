export function getDateAtMidnight(dateStr: string): Date {
  return new Date(dateStr).setHours(0, 0, 0, 0);
}
