import { useStats } from "@/src/hooks/endpoints/useStats";
import { AvgReleasesPerDay } from "@/src/types/git";

export default function AvgReleasesPerDaySlide() {
  const { data, error, isLoading } = useStats<AvgReleasesPerDay>({
    part: "avgReleasesPerDay",
  });

  return (
    <div className="AvgReleasesPerDaySlide">
      <h1>This is the AvgReleasesPerDaySlide component!</h1>
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
