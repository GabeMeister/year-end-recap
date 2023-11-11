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
