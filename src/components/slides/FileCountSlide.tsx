import { useStats } from "@/src/hooks/endpoints/useStats";
import { FileCount } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import getPercentDifference from "@/src/utils/math";
import { CURRENT_YEAR, PREV_YEAR } from "@/src/utils/date";

type FileCountSlideProps = {
  part: string;
};

export default function FileCountSlide({ part }: FileCountSlideProps) {
  const { data, error, isLoading } = useStats<FileCount>({
    part: "fileCount",
  });

  return (
    <div className="FileCountSlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">File Count</h1>
            </div>
          )}
          {part === "prev_year_number" && (
            <div className="flex flex-col items-center justify-center">
              <h1>
                <span className="text-7xl  text-yellow-300 font-bold">
                  {data.prevYear.toLocaleString()}
                </span>{" "}
                <span className="text-7xl inline-block ml-6">Total Files</span>
              </h1>
              <div className="mt-6 text-3xl italic text-gray-500">
                in {PREV_YEAR}
              </div>
            </div>
          )}
          {part === "curr_year_number" && (
            <div className="flex flex-col items-center justify-center">
              <h1>
                <span className="text-7xl font-bold text-green-300">
                  {data.currYear.toLocaleString()}
                </span>{" "}
                <span className="text-7xl inline-block ml-6">Total Files</span>
              </h1>
              <div className="mt-6 text-3xl italic text-gray-500">
                in {CURRENT_YEAR}!
              </div>
            </div>
          )}
          {part === "percent_increase" && (
            <h1>
              <span className="text-7xl  text-yellow-300 font-bold">
                {getPercentDifference(data.prevYear, data.currYear)}
              </span>{" "}
              <span className="text-7xl inline-block ml-6">
                {data.prevYear > data.currYear ? "decrease" : "increase!"}
              </span>
            </h1>
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
