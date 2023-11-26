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
              <h1 className="font-bold text-8xl text-yellow-300">
                {data.count.toFixed(2)}
              </h1>{" "}
              <h1 className="font-normal text-4xl inline-block mt-6">
                Releases / Day!
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
