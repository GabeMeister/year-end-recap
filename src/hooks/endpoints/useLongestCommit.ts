import { get } from "@/src/utils/fetchers";
import useSWR from "swr";

export type LongestCommitQuery = {
  id: number;
};

export type LongestCommitResponse = {
  name: string | null;
  created_date: Date | null;
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

  return { data: data as LongestCommitResponse, error, isLoading };
}
