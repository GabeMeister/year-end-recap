import { useStats } from "@/src/hooks/endpoints/useStats";
import { LongestFiles } from "@/src/types/git";

type LongestFilesSlideProps = {
  part: string;
};

export default function LongestFilesSlide({ part }: LongestFilesSlideProps) {
  const { data, error, isLoading } = useStats<LongestFiles>({
    part: "longestFiles",
  });

  return (
    <div className="LongestFilesSlide">
      {data && (
        <div>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Longest Files</h1>
            </div>
          )}
          {part === "third_place" && (
            <div className="flex flex-col items-center">
              <h1>3rd Place</h1>
              <div>{data[2].path}</div>
              <div className="italic">({data[2].lines} lines)</div>
            </div>
          )}
          {part === "second_place" && (
            <div className="flex flex-col items-center">
              <h1>2nd Place</h1>
              <div>{data[1].path}</div>
              <div className="italic">({data[1].lines} lines)</div>
            </div>
          )}
          {part === "first_place" && (
            <div className="flex flex-col items-center">
              <h1>1st Place</h1>
              <div>{data[0].path}</div>
              <div className="italic">({data[0].lines} lines)</div>
            </div>
          )}
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
