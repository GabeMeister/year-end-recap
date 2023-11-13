import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamCommitsByMonth } from "@/src/types/git";

export default function TeamCommitsByMonthSlide() {
  const { data, error, isLoading } = useStats<TeamCommitsByMonth>({
    part: "teamCommitsByMonth",
  });

  return (
    <div className="TeamCommitsByMonthSlide">
      <h1>This is the TeamCommitsByMonthSlide component!</h1>
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
