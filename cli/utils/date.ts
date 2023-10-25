export function getDateAtMidnight(dateStr: string): number {
  return new Date(dateStr).setHours(0, 0, 0, 0);
}
