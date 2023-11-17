import { useStats } from "@/src/hooks/endpoints/useStats";
import { Commit } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

export default function ShortestCommitsSlide() {
  const { data, error, isLoading } = useStats<Commit[]>({
    part: "shortestCommits",
  });

  return (
    <div className="ShortestCommitsSlide">
      <h1>This is the ShortestCommitsSlide component!</h1>
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
