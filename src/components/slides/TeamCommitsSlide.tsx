import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamCommitData } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";

type TeamCommitsSlideProps = {
  part: string;
};

// ["title", "prev_year_number", "curr_year_number"]

export default function TeamCommitsSlide({ part }: TeamCommitsSlideProps) {
  const { data, isLoading, error } = useStats<TeamCommitData>({
    part: "teamCommits",
  });

  return (
    <div className="TeamCommitsSlide">
      <div>
        {data && (
          <div>
            {part === "title" && (
              <div>
                <h1 className="text-5xl slide-fade-in">Team Commits</h1>
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
