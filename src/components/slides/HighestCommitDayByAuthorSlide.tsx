import { useStats } from "@/src/hooks/endpoints/useStats";
import { HighestCommitDaySummary } from "@/src/types/git";

export default function HighestCommitDayByAuthorSlide() {
  const { data, error, isLoading } = useStats<HighestCommitDaySummary>({
    part: "highestCommitDayByAuthor",
  });

  return (
    <div className="HighestCommitDayByAuthorSlide">
      <h1>This is the HighestCommitDayByAuthorSlide component!</h1>
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
