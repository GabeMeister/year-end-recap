/*
 *  Fetch wrappers to hit frontend API endpoints. Meant to be used by React code
 *  in the browser.
 */

import { stringify } from "qs";

// 'comma' and 'indices' tell the parser how to deal with arrays.
// For example if we have the following object to be stringified:
//   {items: ['hello', 'there']}
//   comma   -> 'items=hello,there'
//   indices -> 'items[0]=hello&items[1]=there'
// There are other ways of dealing with arrays, but these are the two most common.
export function stringifyQuery(
  params: object,
  arrayFormat: "comma" | "indices" = "comma"
): string {
  return stringify(params, { arrayFormat, skipNulls: true });
}

export async function get(endpoint: string, query: object = {}) {
  return fetch(endpoint + "?" + stringifyQuery(query), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export async function post(endpoint: string, query: object = {}, body = {}) {
  // if (defaultHeaders.csrfToken === '') {
  //   throw new Error('CSRF Token not defined!');
  // }

  return fetch(endpoint + "?" + stringifyQuery(query), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

const Api = {
  get,
  post,
};

export default Api;
