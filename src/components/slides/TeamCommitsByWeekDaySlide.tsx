import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamCommitsByWeekDay } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

export default function TeamCommitsByWeekDaySlide() {
  const { data, error, isLoading } = useStats<TeamCommitsByWeekDay>({
    part: "teamCommitsByWeekDay",
  });

  return (
    <div className="TeamCommitsByWeekDaySlide">
      <h1>This is the TeamCommitsByWeekDaySlide component!</h1>
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
