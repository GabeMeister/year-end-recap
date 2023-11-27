import { pickBy } from "lodash";
import { stringifyQuery } from "./fetchers";

export function getUrlPathWithQueryParams(path, queryParams = {}) {
  // Strip out any query params that are null or undefined. But keep query
  // params like `0`.
  const query = pickBy(queryParams, (item) => {
    return item !== null && item !== undefined;
  });

  const fullPath = `${path}?${stringifyQuery(query, "indices")}`;

  return fullPath;
}

export function isClient() {
  return typeof window !== "undefined";
}

export function isMobile() {
  if (!isClient()) {
    throw new Error(
      "isMobile() is being used on the server. Please dynamically import your component."
    );
  }

  // I know it seems crazy, but you just can't really examine a graph well when
  // the browser window is less than 1,100 px wide.
  return window.innerWidth < 1100;
}
