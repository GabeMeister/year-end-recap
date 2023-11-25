import { useStats } from "@/src/hooks/endpoints/useStats";
import { FileCount } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type EndingSlideProps = {
  part: string;
};

export default function EndingSlide({ part }: EndingSlideProps) {
  const { data, error, isLoading } = useStats<FileCount>({
    part: "fileCount",
  });

  return (
    <div className="EndingSlide">
      {data && (
        <div>
          {part === "main" && (
            <div>
              <h1 className="text-7xl slide-fade-in">The End</h1>
            </div>
          )}
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
