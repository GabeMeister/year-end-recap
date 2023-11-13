import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamCommitData } from "@/src/types/git";

export default function TeamCommitsSlide() {
  const { data, isLoading, error } = useStats<TeamCommitData>({
    part: "teamCommits",
  });

  return (
    <div className="TeamCommitsSlide">
      <h1>Team Commits</h1>
      <div>
        {data && (
          <div className="overflow-scroll h-96 w-[700px]">
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
