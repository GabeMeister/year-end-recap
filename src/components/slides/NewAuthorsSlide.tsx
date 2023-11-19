import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamAuthorData } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import getPercentDifference from "@/src/utils/math";

type NewAuthorsSlide = {
  part: string;
};

export default function NewAuthorsSlide({ part }: NewAuthorsSlide) {
  const { data, isLoading, error } = useStats<TeamAuthorData>({
    part: "newAuthors",
  });

  // previousYearCount: number;
  // currentYearCount: number;

  return (
    <div className="NewAuthorsSlide">
      <div>
        {data && (
          <div className="">
            {part === "title" && (
              <div>
                <h1 className="text-5xl slide-fade-in">Team Size</h1>
              </div>
            )}
            {part === "prev_year_number" && (
              <div>
                <div>Last year: {data.previousYearCount}</div>
              </div>
            )}
            {part === "curr_year_number" && (
              <div>
                <div>This year: {data.currentYearCount}</div>
              </div>
            )}
            {part === "percent_increase" && (
              <div>
                <div>
                  {getPercentDifference(
                    data.previousYearCount,
                    data.currentYearCount
                  )}{" "}
                  increase!
                </div>
              </div>
            )}
            {part === "list_names" && (
              <div>
                <div className="overflow-y-scroll h-96">
                  <h1>Authors:</h1>
                  <pre>{JSON.stringify(data.newAuthors, null, 2)}</pre>
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
    </div>
  );
}
