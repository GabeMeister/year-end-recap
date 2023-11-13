import { useStats } from "@/src/hooks/endpoints/useStats";
import { AuthorCommitsOverTime } from "@/src/types/git";

export default function AuthorCommitsOverTimeSlide() {
  const { data, error, isLoading } = useStats<AuthorCommitsOverTime>({
    part: "authorCommitsOverTime",
  });

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
