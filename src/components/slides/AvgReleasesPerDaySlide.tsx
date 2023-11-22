import { useStats } from "@/src/hooks/endpoints/useStats";
import { AvgReleasesPerDay } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type AvgReleasesPerDaySlideProps = {
  part: string;
};

export default function AvgReleasesPerDaySlide({
  part,
}: AvgReleasesPerDaySlideProps) {
  const { data, error, isLoading } = useStats<AvgReleasesPerDay>({
    part: "avgReleasesPerDay",
  });

  return (
    <div className="AvgReleasesPerDaySlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">
                Average Releases per Day
              </h1>
            </div>
          )}
          {part === "main" && (
            <div className="flex flex-col justify-center items-center">
              <h1>
                <span className="font-bold text-6xl text-green-300">
                  {data.count.toFixed(2)}
                </span>{" "}
                <span className="font-normal text-6xl inline-block ml-3">
                  Releases / Day <span className="text-5xl">💪</span>
                </span>
              </h1>
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
