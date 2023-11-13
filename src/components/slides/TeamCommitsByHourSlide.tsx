import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamCommitsByHour } from "@/src/types/git";

export default function TeamCommitsByHourSlide() {
  const { data, error, isLoading } = useStats<TeamCommitsByHour>({
    part: "teamCommitsByHour",
  });

  return (
    <div className="TeamCommitsByHourSlide">
      <h1>This is the TeamCommitsByHourSlide component!</h1>
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
