import { Commit } from "@/src/types/git";
import { get } from "@/src/utils/fetchers";
import useSWR from "swr";

export type LongestCommitQuery = {
  id: number;
};

export function useLongestCommit({ id }: LongestCommitQuery) {
  const { data, error, isLoading } = useSWR(
    {
      endpoint: "/api/longest-commit",
      query: {
        id,
      },
    },
    get
  );

  return { data: data as Commit, error, isLoading };
}
