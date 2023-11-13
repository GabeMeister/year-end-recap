import { get } from "@/src/utils/fetchers";
import { useRouter } from "next/router";
import useSWR from "swr";

type Params = {
  part: string;
};

export function useStats<T>({ part }: Params) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    {
      endpoint: "/api/stats",
      query: {
        id: parseInt((router.query?.project_id as string) ?? "0"),
        part,
      },
    },
    get
  );

  return { data: data as T, error, isLoading };
}
