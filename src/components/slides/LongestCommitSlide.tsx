import { useStats } from "@/src/hooks/endpoints/useStats";
import { Commit } from "@/src/types/git";

export default function LongestCommitSlide() {
  const { data, error, isLoading } = useStats<Commit>({
    part: "longestCommit",
  });

  return (
    <div className="LongestCommitSlide">
      <h1>This is the LongestCommitSlide component!</h1>
      {data && (
        <div className="overflow-y-scroll h-[500px] w-[700px]">
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
  );
}
