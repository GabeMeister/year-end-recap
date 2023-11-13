import { useTeamCommits } from "@/src/hooks/endpoints/useTeamCommits";

export default function TeamCommitsSlide() {
  const { data, isLoading, error } = useTeamCommits();

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
