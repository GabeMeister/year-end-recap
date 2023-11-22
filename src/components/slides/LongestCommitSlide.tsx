import { useStats } from "@/src/hooks/endpoints/useStats";
import { Commit } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { format } from "date-fns";

type LongestCommitSlideProps = {
  part: string;
};

export default function LongestCommitSlide({ part }: LongestCommitSlideProps) {
  const { data, error, isLoading } = useStats<Commit>({
    part: "longestCommit",
  });

  return (
    <div className="LongestCommitSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Longest Commit</h1>
            </div>
          )}
          {part === "author" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data.author_name}</h1>
              <h1>{format(new Date(data.author_when), "MM-dd-yyyy")}</h1>
            </div>
          )}
          {part === "commit" && (
            <div className="overflow-y-scroll h-[600px] w-[900px]">
              <pre className="whitespace-pre-wrap">{data.message}</pre>
              <br />
              <span className="text-yellow-200 italic">{`(${data.length.toLocaleString()} characters)`}</span>
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
