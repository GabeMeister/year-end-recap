import { useStats } from "@/src/hooks/endpoints/useStats";
import { MostReleasesInDay } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { format } from "date-fns";

type MostReleasesInDaySlideProps = {
  part: string;
};

export default function MostReleasesInDaySlide({
  part,
}: MostReleasesInDaySlideProps) {
  const { data, error, isLoading } = useStats<MostReleasesInDay>({
    part: "mostReleasesInDay",
  });

  return (
    <div className="MostReleasesInDaySlide">
      {data && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">Most Releases in a Day</h1>
            </div>
          )}
          {part === "main" && (
            <div className="flex flex-col justify-center items-center">
              <h1>
                <span className="font-bold text-6xl text-yellow-200">
                  {data.count}
                </span>{" "}
                <span className="font-normal text-6xl inline-block ml-3">
                  Releases!
                </span>
              </h1>
              <h3 className="italic inline-block mt-6">
                on {format(new Date(data.date), "LLLL dd, yyyy")}
              </h3>
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
