import { useAuthorCommitsOverTime } from "@/src/hooks/endpoints/useAuthorCommitsOverTime";

export default function AuthorCommitsOverTimeSlide() {
  const { data, error, isLoading } = useAuthorCommitsOverTime();

  return (
    <div className="AuthorCommitsOverTimeSlide">
      <h1>This is the AuthorCommitsOverTimeSlide component!</h1>
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
