import { Commit } from "@/src/types/git";
import { get } from "@/src/utils/fetchers";
import useSWR from "swr";

export type ShortestCommitsQuery = {
  id: number;
};

export function useShortestCommits({ id }: ShortestCommitsQuery) {
  const { data, error, isLoading } = useSWR(
    {
      endpoint: "/api/shortest-commits",
      query: {
        id,
      },
    },
    get
  );

  return { data: data as Commit[], error, isLoading };
}
