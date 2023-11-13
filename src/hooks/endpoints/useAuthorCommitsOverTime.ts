import { AuthorCommitsOverTime } from "@/src/types/git";
import { get } from "@/src/utils/fetchers";
import { useRouter } from "next/router";
import useSWR from "swr";

export function useAuthorCommitsOverTime() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    {
      endpoint: "/api/stats",
      query: {
        id: parseInt((router.query?.project_id as string) ?? "0"),
        part: "authorCommitsOverTime",
      },
    },
    get
  );

  return { data: data as AuthorCommitsOverTime, error, isLoading };
}
