import { useAllTimeAuthorCommits } from "@/src/hooks/endpoints/useAllTimeAuthorCommits";

export default function AllTimeAuthorCommitsSlide() {
  const { data, error, isLoading } = useAllTimeAuthorCommits();

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
