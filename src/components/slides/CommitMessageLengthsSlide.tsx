import { useStats } from "@/src/hooks/endpoints/useStats";
import { CommitMessageLength } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

export default function CommitMessageLengthsSlide() {
  const { data, error, isLoading } = useStats<CommitMessageLength[]>({
    part: "commitMessageLengths",
  });

  return (
    <div className="CommitMessageLengthsSlide">
      <h1>This is the CommitMessageLengthsSlide component!</h1>
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
