import { get } from "@/src/utils/fetchers";
import useSWR from "swr";

export type AboutRepoQuery = {
  id: number;
};

export type AboutRepoResponse = {
  name: string | null;
  created_date: Date | null;
};

export function useAboutRepo({ id }: AboutRepoQuery) {
  const { data, error, isLoading } = useSWR(
    {
      endpoint: "/api/about-repo",
      query: {
        id,
      },
    },
    get
  );

  return { data: data as AboutRepoResponse, error, isLoading };
}
