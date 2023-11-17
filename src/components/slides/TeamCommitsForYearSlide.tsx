import { useStats } from "@/src/hooks/endpoints/useStats";
import LoadingSpinner from "../LoadingSpinner";

export default function TeamCommitsForYearSlide() {
  const { data, error, isLoading } = useStats<number>({
    part: "teamCommitsForYear",
  });

  return (
    <div className="TeamCommitsForYearSlide">
      <h1>This is the TeamCommitsForYearSlide component!</h1>
      {data && (
        <div className="overflow-y-scroll h-[500px] w-[700px]">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {isLoading && (
        <div>
          <LoadingSpinner />
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
