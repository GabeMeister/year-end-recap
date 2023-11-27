import { useStats } from "@/src/hooks/endpoints/useStats";
import { LongestFiles } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type LongestFilesSlideProps = {
  part: string;
};

export default function LongestFilesSlide({ part }: LongestFilesSlideProps) {
  const { data, error, isLoading } = useStats<LongestFiles>({
    part: "longestFiles",
  });

  function getFontSizeThatFits(length: number): string {
    if (length <= 60) {
      return "text-3xl";
    } else if (length > 60 && length <= 80) {
      return "text-2xl";
    } else {
      return "text-xl";
    }
  }

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
              <h1 className="text-5xl italic text-yellow-600">
                <span className="font-bold">3</span>
                <span className="text-3xl ">rd Place:</span>
              </h1>
              <div
                className={`mt-6 text-yellow-300 text-center ${getFontSizeThatFits(
                  data[2].path.length
                )}`}
              >
                {data[2].path}
              </div>
              <div className="italic mt-6 text-lg text-gray-500">
                ({data[2].lines.toLocaleString()} lines)
              </div>
            </div>
          )}
          {part === "second_place" && (
            <div className="flex flex-col items-center">
              <h1 className="text-5xl italic text-gray-400">
                <span className="font-bold">2</span>
                <span className="text-3xl ">nd Place:</span>
              </h1>
              <div
                className={`mt-6 text-yellow-300 text-center ${getFontSizeThatFits(
                  data[1].path.length
                )}`}
              >
                {data[1].path}
              </div>
              <div className="italic mt-6 text-lg text-gray-500">
                ({data[1].lines.toLocaleString()} lines)
              </div>
            </div>
          )}
          {part === "first_place" && (
            <div className="flex flex-col items-center">
              <h1 className="text-5xl italic text-yellow-400">
                <span className="font-bold">1</span>
                <span className="text-3xl ">st Place:</span>
              </h1>
              <div
                className={`mt-6 text-yellow-300 text-center ${getFontSizeThatFits(
                  data[0].path.length
                )}`}
              >
                {data[0].path}
              </div>
              <div className="italic mt-6 text-lg text-gray-500">
                ({data[0].lines.toLocaleString()} lines)
              </div>
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
