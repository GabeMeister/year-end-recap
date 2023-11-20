import { useStats } from "@/src/hooks/endpoints/useStats";
import { Commit } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type ShortestCommitsSlideProps = {
  part: string;
};

export default function ShortestCommitsSlide({
  part,
}: ShortestCommitsSlideProps) {
  const { data, error, isLoading } = useStats<Commit[]>({
    part: "shortestCommits",
  });

  return (
    <div className="ShortestCommitsSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Shortest Commits</h1>
            </div>
          )}
          {part === "first" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data[0].author_name}</h1>
              <h2>{data[0].message.replace("\n", "")}</h2>
            </div>
          )}
          {part === "second" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data[1].author_name}</h1>
              <h2>{data[1].message.replace("\n", "")}</h2>
            </div>
          )}
          {part === "third" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data[2].author_name}</h1>
              <h2>{data[2].message.replace("\n", "")}</h2>
            </div>
          )}
          {part === "fourth" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data[3].author_name}</h1>
              <h2>{data[3].message.replace("\n", "")}</h2>
            </div>
          )}
          {part === "fifth" && (
            <div className="overflow-y-scroll h-[500px] w-[700px]">
              <h1>{data[4].author_name}</h1>
              <h2>{data[4].message.replace("\n", "")}</h2>
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
