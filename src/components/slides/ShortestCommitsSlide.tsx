import { useLongestCommit } from "@/src/hooks/endpoints/useLongestCommit";
import { useRouter } from "next/router";

export default function ShortestCommitsSlide() {
  const router = useRouter();
  const { data, isLoading, error } = useLongestCommit({
    id: parseInt((router.query?.project_id as string) ?? "0"),
  });

  return (
    <div className="ShortestCommitsSlide">
      <h1>Shortest Commits</h1>
      <div>
        {data && (
          <div>
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
