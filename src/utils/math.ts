export default function getPercentDifference(
  current: number,
  next: number
): string {
  return (((next - current) / current) * 100).toFixed(1) + "%";
}
