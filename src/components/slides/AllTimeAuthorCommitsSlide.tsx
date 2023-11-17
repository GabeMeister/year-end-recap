import { useStats } from "@/src/hooks/endpoints/useStats";
import { AuthorCommits } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

export default function AllTimeAuthorCommitsSlide() {
  const { data, error, isLoading } = useStats<AuthorCommits[]>({
    part: "allTimeAuthorCommits",
  });

  return (
    <div className="AllTimeAuthorCommitsSlide">
      <h1>This is the AllTimeAuthorCommitsSlide component!</h1>
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
