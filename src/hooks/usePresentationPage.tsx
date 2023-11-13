import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AboutSlide from "@/src/components/slides/AboutSlide";
import NewAuthorsSlide from "@/src/components/slides/NewAuthorsSlide";
import TeamCommitsSlide from "@/src/components/slides/TeamCommitsSlide";
import FileCountSlide from "@/src/components/slides/FileCountSlide";
import LinesOfCodeSlide from "@/src/components/slides/LinesOfCodeSlide";
import LongestFilesSlide from "@/src/components/slides/LongestFilesSlide";
import AuthorCommitsOverTimeSlide from "@/src/components/slides/AuthorCommitsOverTimeSlide";
import AllTimeAuthorCommitsSlide from "@/src/components/slides/AllTimeAuthorCommitsSlide";
import TeamCommitsForYearSlide from "@/src/components/slides/TeamCommitsForYearSlide";
import TeamChangedLinesForYearSlide from "@/src/components/slides/TeamChangedLinesForYearSlide";
import TeamCommitsByMonthSlide from "@/src/components/slides/TeamCommitsByMonthSlide";
import TeamCommitsByWeekDaySlide from "@/src/components/slides/TeamCommitsByWeekDaySlide";
import TeamCommitsByHourSlide from "@/src/components/slides/TeamCommitsByHourSlide";
import HighestCommitDayByAuthorSlide from "@/src/components/slides/HighestCommitDayByAuthorSlide";
import CommitMessageLengthsSlide from "@/src/components/slides/CommitMessageLengthsSlide";
import LongestCommitSlide from "@/src/components/slides/LongestCommitSlide";
import ShortestCommitsSlide from "@/src/components/slides/ShortestCommitsSlide";
import AvgReleasesPerDaySlide from "@/src/components/slides/AvgReleasesPerDaySlide";
import MostReleasesInDaySlide from "@/src/components/slides/MostReleasesInDaySlide";
import { getNextSlide, getPrevSlide } from "@/src/utils/slides";

type usePresentationPageParams = {
  id: number;
  slide: string;
};

export default function usePresentationPage({
  id,
  slide,
}: usePresentationPageParams) {
  const router = useRouter();
  const [isNavigatingBackward, setIsNavigatingBackward] = useState(false);
  const [isNavigatingForward, setIsNavigatingForward] = useState(false);
  const nextSlide = getNextSlide(slide);
  const prevSlide = getPrevSlide(slide);

  useEffect(() => {
    const handleRouteChange = (_url) => {
      setIsNavigatingBackward(false);
      setIsNavigatingForward(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, setIsNavigatingBackward, setIsNavigatingForward]);

  function getSlideComponent(slide: string) {
    let slideComponent: JSX.Element = <></>;

    switch (slide) {
      case "about":
        slideComponent = <AboutSlide />;
        break;
      case "new_authors":
        slideComponent = <NewAuthorsSlide />;
        break;
      case "team_commits":
        slideComponent = <TeamCommitsSlide />;
        break;
      case "file_count":
        slideComponent = <FileCountSlide />;
        break;
      case "lines_of_code":
        slideComponent = <LinesOfCodeSlide />;
        break;
      case "longest_files":
        slideComponent = <LongestFilesSlide />;
        break;
      case "author_commits_over_time":
        slideComponent = <AuthorCommitsOverTimeSlide />;
        break;
      case "all_time_author_commits":
        slideComponent = <AllTimeAuthorCommitsSlide />;
        break;
      case "team_commits_for_year":
        slideComponent = <TeamCommitsForYearSlide />;
        break;
      case "team_changed_lines_for_year":
        slideComponent = <TeamChangedLinesForYearSlide />;
        break;
      case "team_commits_by_month":
        slideComponent = <TeamCommitsByMonthSlide />;
        break;
      case "team_commits_by_week_day":
        slideComponent = <TeamCommitsByWeekDaySlide />;
        break;
      case "team_commits_by_hour":
        slideComponent = <TeamCommitsByHourSlide />;
        break;
      case "highest_commit_day_by_author":
        slideComponent = <HighestCommitDayByAuthorSlide />;
        break;
      case "longest_commit":
        slideComponent = <LongestCommitSlide />;
        break;
      case "shortest_commits":
        slideComponent = <ShortestCommitsSlide />;
        break;
      case "commit_message_lengths":
        slideComponent = <CommitMessageLengthsSlide />;
        break;
      case "avg_releases_per_day":
        slideComponent = <AvgReleasesPerDaySlide />;
        break;
      case "most_releases_in_day":
        slideComponent = <MostReleasesInDaySlide />;
        break;

      default:
        throw new Error("Slide is not found. This should not have happened.");
    }

    return slideComponent;
  }

  function goToPrevSlide() {
    setIsNavigatingBackward(true);

    router.push({
      pathname: `/presentation/${id}`,
      query: {
        slide: prevSlide,
      },
    });
  }

  function goToNextSlide() {
    setIsNavigatingForward(true);

    router.push({
      pathname: `/presentation/${id}`,
      query: {
        slide: nextSlide,
      },
    });
  }

  return {
    isNavigatingBackward,
    isNavigatingForward,
    slideComponent: getSlideComponent(slide),
    goToPrevSlide,
    goToNextSlide,
  };
}