import { useStats } from "@/src/hooks/endpoints/useStats";
import { LineChangeStat } from "@/src/types/git";

export default function TeamChangedLinesForYearSlide() {
  const { data, error, isLoading } = useStats<LineChangeStat>({
    part: "teamChangedLinesForYear",
  });

  return (
    <div className="TeamChangedLinesForYearSlide">
      <h1>This is the TeamChangedLinesForYearSlide component!</h1>
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
