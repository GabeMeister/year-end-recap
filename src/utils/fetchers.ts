import { stringify } from "qs";

export type FetcherParams = {
  endpoint: string;
  query?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, any>;
};

// 'comma' and 'indices' tell the parser how to deal with arrays.
// For example if we have the following object to be stringified:
//   {items: ['hello', 'there']}
//   comma   -> 'items=hello,there'
//   indices -> 'items[0]=hello&items[1]=there'
// There are other ways of dealing with arrays, but these are the two most common.
export function stringifyQuery(
  params: Record<string, any>,
  arrayFormat: "comma" | "indices" = "comma"
): string {
  return stringify(params, { arrayFormat, skipNulls: true });
}

export function get(params: FetcherParams) {
  return fetch(params.endpoint + "?" + stringifyQuery(params?.query ?? {}), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export function post(params: FetcherParams) {
  return fetch(params.endpoint + "?" + stringifyQuery(params?.query ?? {}), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(params?.headers ?? {}),
    },
    body: JSON.stringify(params?.body ?? {}),
  }).then((res) => res.json());
}

export function patch(params: FetcherParams) {
  return fetch(params.endpoint + "?" + stringifyQuery(params?.query ?? {}), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(params?.headers ?? {}),
    },
    body: JSON.stringify(params?.body ?? {}),
  }).then((res) => res.json());
}

export function del(params: FetcherParams) {
  return fetch(params.endpoint + "?" + stringifyQuery(params?.query ?? {}), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(params?.headers ?? {}),
    },
    body: JSON.stringify(params?.body ?? {}),
  }).then((res) => res.json());
}
