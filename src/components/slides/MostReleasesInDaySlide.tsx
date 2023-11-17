import { useStats } from "@/src/hooks/endpoints/useStats";
import { MostReleasesInDay } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

export default function MostReleasesInDaySlide() {
  const { data, error, isLoading } = useStats<MostReleasesInDay>({
    part: "mostReleasesInDay",
  });

  return (
    <div className="MostReleasesInDaySlide">
      <h1>This is the MostReleasesInDaySlide component!</h1>
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
