import { DUPLICATE_GIT_AUTHOR_NAME_MAP } from "./constants";

export function getAuthorName(name: string): string {
  return DUPLICATE_GIT_AUTHOR_NAME_MAP[name] ?? name;
}
