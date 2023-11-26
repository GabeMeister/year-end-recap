import { useStats } from "@/src/hooks/endpoints/useStats";
import { AuthorFirstCommit, TeamAuthorData } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import getPercentDifference from "@/src/utils/math";
import { CURRENT_YEAR, PREV_YEAR } from "@/src/utils/date";
import { format } from "date-fns";

type NewAuthorsSlideProps = {
  part: string;
};

export default function NewAuthorsSlide({ part }: NewAuthorsSlideProps) {
  const { data, isLoading, error } = useStats<TeamAuthorData>({
    part: "newAuthors",
  });

  let authors: AuthorFirstCommit[] = [];
  if (data) {
    authors = data.newAuthors.sort((a, b) => {
      const d1 = new Date(b.first_commit);
      const d2 = new Date(a.first_commit);

      if (d1 > d2) {
        return -1;
      } else if (d2 < d1) {
        return 1;
      } else {
        return 0;
      }
    });
  }

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
              <div className="flex flex-col items-center justify-center">
                <h1>
                  <span className="text-7xl  text-yellow-300 font-bold">
                    {data.previousYearCount.toLocaleString()}
                  </span>{" "}
                  <span className="text-7xl inline-block ml-6">Engineers</span>
                </h1>
                <div className="mt-6 text-3xl italic text-gray-500">
                  in {PREV_YEAR}
                </div>
              </div>
            )}
            {part === "curr_year_number" && (
              <div className="flex flex-col items-center justify-center">
                <h1>
                  <span className="text-7xl  text-green-300 font-bold">
                    {data.currentYearCount}
                  </span>{" "}
                  <span className="text-7xl inline-block ml-6">Engineers</span>
                </h1>
                <div className="mt-6 text-3xl italic text-gray-500">
                  in {CURRENT_YEAR}!
                </div>
              </div>
            )}
            {part === "percent_increase" && (
              <h1>
                <span className="text-7xl  text-yellow-300 font-bold">
                  {getPercentDifference(
                    data.previousYearCount,
                    data.currentYearCount
                  )}
                </span>{" "}
                <span className="text-7xl inline-block ml-6">
                  {data.previousYearCount > data.currentYearCount
                    ? "decrease"
                    : "increase!"}
                </span>
              </h1>
            )}
            {part === "list_names" && (
              <div>
                <h1 className="text-5xl inline-block mb-6">New Authors:</h1>
                <div className="overflow-y-scroll h-96 mt-6 pr-2">
                  <ul>
                    {authors.map((author) => (
                      <li key={author.first_commit.valueOf()} className="mt-6">
                        <h2 className="text-3xl text-yellow-300">
                          {author.name}
                        </h2>
                        <span className="italic">
                          {format(
                            new Date(author.first_commit),
                            "LLLL dd, yyyy"
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
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
