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

  const Content = ({ idx }: { idx: number }) => (
    <div className="h-[500px] w-[700px] flex flex-col justify-evenly items-center">
      <h1 className="text-5xl">{data[idx].author_name}:</h1>
      <h2 className="text-9xl p-6 rounded-md bg-slate-700 w-fit">
        {data[idx].message.replace("\n", "")}
      </h2>
    </div>
  );

  return (
    <div className="ShortestCommitsSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Shortest Commits</h1>
            </div>
          )}
          {part === "first" && <Content idx={0} />}
          {part === "second" && <Content idx={1} />}
          {part === "third" && <Content idx={2} />}
          {part === "fourth" && <Content idx={3} />}
          {part === "fifth" && <Content idx={4} />}
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
