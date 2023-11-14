export function isSuperset(superset: object, subset: object): boolean {
  return Object.keys(subset).every((key) =>
    isDeepEqual(superset[key], subset[key])
  );
}

export const isDeepEqual = (obj1: unknown, obj2: unknown): boolean =>
  typeof obj1 === "function"
    ? obj1 === obj2
    : JSON.stringify(sortObject(obj1)) === JSON.stringify(sortObject(obj2));

export const sortObject = (obj: unknown) =>
  typeof obj === "object" && obj !== null
    ? Object.keys(obj)
        .sort()
        .reduce((sortedObj, key) => {
          sortedObj[key] = sortObject(obj[key]);
          return sortedObj;
        }, {})
    : obj;
