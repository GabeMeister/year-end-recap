import { useStats } from "@/src/hooks/endpoints/useStats";
import { AuthorCommitsOverTime } from "@/src/types/git";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect } from "react";
import paintRacingBarChart from "@/src/utils/racing-bar-chart";

type AuthorCommitsOverTimeSlide = {
  part: string;
};

export default function AuthorCommitsOverTimeSlide({
  part,
}: AuthorCommitsOverTimeSlide) {
  const {
    data: commitsOverTime,
    error,
    isLoading,
  } = useStats<AuthorCommitsOverTime>({
    part: "authorCommitsOverTime",
  });

  useEffect(() => {
    if (!commitsOverTime) {
      return;
    }

    if (!!document.querySelector("#racing-bar-chart svg")) {
      return;
    }

    paintRacingBarChart({ commitsOverTime, width: 1000 });

    return () => {
      document.querySelector("#racing-bar-chart svg")?.remove();
    };
  }, [commitsOverTime, part]);

  return (
    <div className="AuthorCommitsOverTimeSlide">
      {commitsOverTime && (
        <>
          {part === "title" && (
            <div>
              <h1 className="text-5xl slide-fade-in">
                Author Commits Over Time
              </h1>
            </div>
          )}
          {part === "main" && (
            <div className="overflow-y-scroll w-[1000px]">
              <div id="racing-bar-chart" />
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
