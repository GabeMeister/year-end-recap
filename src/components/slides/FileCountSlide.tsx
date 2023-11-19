import { useStats } from "@/src/hooks/endpoints/useStats";
import { FileCount } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import getPercentDifference from "@/src/utils/math";

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
        <div>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Number of Files</h1>
            </div>
          )}
          {part === "prev_year_number" && (
            <div>
              <h1>Last Year</h1>
              <div>{data.prevYear}</div>
            </div>
          )}
          {part === "curr_year_number" && (
            <div>
              <h1>This Year</h1>
              <div>{data.currYear}</div>
            </div>
          )}
          {part === "percent_increase" && (
            <div>
              {getPercentDifference(data.prevYear, data.currYear)} increase!
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
