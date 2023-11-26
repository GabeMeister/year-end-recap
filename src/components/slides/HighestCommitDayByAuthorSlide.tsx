import { useStats } from "@/src/hooks/endpoints/useStats";
import { HighestCommitDaySummary } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { format } from "date-fns";

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
            <div className="text-center h-[500px] w-[700px] flex flex-col items-center justify-center">
              <h1 className="text-7xl text-yellow-300">{data.authorName}</h1>
              <h1 className="text-3xl inline-block mt-6 text-gray-400">
                committed{" "}
                <span className="font-bold text-4xl text-white">
                  {data.count}
                </span>{" "}
                times
              </h1>
              <h1 className="mt-5 text-xl text-gray-400">
                on{" "}
                <span className="text-white font-semibold">
                  {format(new Date(data.date), "LLLL dd, yyyy")}
                </span>
              </h1>
            </div>
          )}
          {part === "commits" && (
            <div className="overflow-y-scroll h-[600px] w-[650px]">
              <ol>
                {data.commitMessages
                  .map((c) => {
                    return (
                      <li className="mb-8" key={c.hash}>
                        <span className="text-yellow-300">
                          {c.hash.slice(0, 8)}
                        </span>{" "}
                        <pre className="whitespace-pre-wrap text-2xl pr-2">
                          {c.message}
                        </pre>
                      </li>
                    );
                  })
                  .toReversed()}
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
