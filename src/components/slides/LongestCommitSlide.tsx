import { useLongestCommit } from "@/src/hooks/endpoints/useLongestCommit";
import { useRouter } from "next/router";

export default function LongestCommitSlide() {
  const router = useRouter();
  const { data, isLoading, error } = useLongestCommit({
    id: parseInt((router.query?.project_id as string) ?? "0"),
  });

  return (
    <div className="LongestCommitSlide">
      <h1>Longest Commit</h1>
      <div>
        {data && (
          <div className="overflow-hidden w-[600px]">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        {isLoading && (
          <div>
            <div>Loading...</div>
          </div>
        )}
        {error && (
          <div>
            <div>Error happened!</div>
          </div>
        )}
      </div>
    </div>
  );
}
