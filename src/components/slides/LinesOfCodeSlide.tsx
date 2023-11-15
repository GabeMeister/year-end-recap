import { useStats } from "@/src/hooks/endpoints/useStats";
import { LinesOfCode } from "@/src/types/git";

type LinesOfCodeSlideProps = {
  part: string;
};

export default function LinesOfCodeSlide({ part }: LinesOfCodeSlideProps) {
  const { data, error, isLoading } = useStats<LinesOfCode>({
    part: "linesOfCode",
  });

  return (
    <div className="LinesOfCodeSlide">
      {data && (
        <div>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Lines of Code</h1>
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
