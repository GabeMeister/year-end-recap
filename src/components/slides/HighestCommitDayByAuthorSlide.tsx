import { useStats } from "@/src/hooks/endpoints/useStats";
import { HighestCommitDaySummary } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type HighestCommitDayByAuthorSlideProps = {
  part: string;
};

export default function HighestCommitDayByAuthorSlide({
  part,
}: HighestCommitDayByAuthorSlideProps) {
  const { data, error, isLoading } = useStats<HighestCommitDaySummary>({
    part: "highestCommitDayByAuthor",
  });

  return (
    <div className="HighestCommitDayByAuthorSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Most Commits in a Day</h1>
            </div>
          )}
          {part === "author" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data.authorName}</h1>
              <h1>{data.date}</h1>
              <h1>{data.count}</h1>
            </div>
          )}
          {part === "commits" && (
            <div className="overflow-y-scroll h-[600px] w-[900px]">
              <ol>
                {data.commitMessages.map((c) => {
                  return (
                    <li className="mb-16" key={c.hash}>
                      <span className="text-yellow-300">{c.hash}</span>{" "}
                      <pre>{c.message}</pre>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </>
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
