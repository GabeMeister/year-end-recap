export function clone(o: object) {
  return JSON.parse(JSON.stringify(o));
}
