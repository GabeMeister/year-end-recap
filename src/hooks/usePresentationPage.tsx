import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AboutSlide from "@/src/components/slides/AboutSlide";
import NewAuthorsSlide from "@/src/components/slides/NewAuthorsSlide";
import TeamCommitsSlide from "@/src/components/slides/TeamCommitsSlide";
import FileCountSlide from "@/src/components/slides/FileCountSlide";
import LinesOfCodeSlide from "@/src/components/slides/LinesOfCodeSlide";
import LongestFilesSlide from "@/src/components/slides/LongestFilesSlide";
import AuthorCommitsOverTimeSlide from "@/src/components/slides/AuthorCommitsOverTimeSlide";
import TeamCommitsByMonthSlide from "@/src/components/slides/TeamCommitsByMonthSlide";
import TeamCommitsByWeekDaySlide from "@/src/components/slides/TeamCommitsByWeekDaySlide";
import TeamCommitsByHourSlide from "@/src/components/slides/TeamCommitsByHourSlide";
import HighestCommitDayByAuthorSlide from "@/src/components/slides/HighestCommitDayByAuthorSlide";
import CommitMessageLengthsSlide from "@/src/components/slides/CommitMessageLengthsSlide";
import LongestCommitSlide from "@/src/components/slides/LongestCommitSlide";
import ShortestCommitsSlide from "@/src/components/slides/ShortestCommitsSlide";
import AvgReleasesPerDaySlide from "@/src/components/slides/AvgReleasesPerDaySlide";
import MostReleasesInDaySlide from "@/src/components/slides/MostReleasesInDaySlide";
import {
  getNextSlide,
  getPrevSlide,
  getSlide,
  isFirstSlide,
  isLastSlide,
} from "@/src/utils/slides";
import useKeyboardShortcuts from "./useKeyboardShortcuts";
import EndingSlide from "../components/slides/EndingSlide";
import AuthorBlameCountsSlide from "../components/slides/AuthorBlameCountsSlide";

type usePresentationPageParams = {
  id: number;
  slide: string;
  part: string;
};

export default function usePresentationPage({
  id,
  slide,
  part,
}: usePresentationPageParams) {
  const router = useRouter();
  const [isNavigatingBackward, setIsNavigatingBackward] = useState(false);
  const [isNavigatingForward, setIsNavigatingForward] = useState(false);
  const nextSlide = getNextSlide(slide, part);
  const prevSlide = getPrevSlide(slide, part);

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

  useKeyboardShortcuts([
    {
      event: { key: "ArrowLeft" },
      callback: async () => {
        goToPrevSlide();
      },
    },
    {
      event: { key: "ArrowRight" },
      callback: async () => {
        goToNextSlide();
      },
    },
  ]);

  function getSlideComponent(slide: string, part: string) {
    let slideComponent: JSX.Element = <></>;
    const slidePart = getSlide(slide, part);

    if (!slidePart) {
      return null;
    }

    switch (slidePart.slide) {
      case "about":
        slideComponent = <AboutSlide />;
        break;
      case "new_authors":
        slideComponent = <NewAuthorsSlide part={slidePart.part} />;
        break;
      case "team_commits":
        slideComponent = <TeamCommitsSlide part={slidePart.part} />;
        break;
      case "file_count":
        slideComponent = <FileCountSlide part={slidePart.part} />;
        break;
      case "lines_of_code":
        slideComponent = <LinesOfCodeSlide part={slidePart.part} />;
        break;
      case "longest_files":
        slideComponent = <LongestFilesSlide part={slidePart.part} />;
        break;
      case "author_commits_over_time":
        slideComponent = <AuthorCommitsOverTimeSlide part={slidePart.part} />;
        break;
      case "team_commits_by_month":
        slideComponent = <TeamCommitsByMonthSlide part={slidePart.part} />;
        break;
      case "team_commits_by_week_day":
        slideComponent = <TeamCommitsByWeekDaySlide part={slidePart.part} />;
        break;
      case "team_commits_by_hour":
        slideComponent = <TeamCommitsByHourSlide part={slidePart.part} />;
        break;
      case "highest_commit_day_by_author":
        slideComponent = (
          <HighestCommitDayByAuthorSlide part={slidePart.part} />
        );
        break;
      case "longest_commit":
        slideComponent = <LongestCommitSlide part={slidePart.part} />;
        break;
      case "shortest_commits":
        slideComponent = <ShortestCommitsSlide part={slidePart.part} />;
        break;
      case "commit_message_lengths":
        slideComponent = <CommitMessageLengthsSlide part={slidePart.part} />;
        break;
      case "author_blame_counts":
        slideComponent = <AuthorBlameCountsSlide part={slidePart.part} />;
        break;
      case "avg_releases_per_day":
        slideComponent = <AvgReleasesPerDaySlide part={slidePart.part} />;
        break;
      case "most_releases_in_day":
        slideComponent = <MostReleasesInDaySlide part={slidePart.part} />;
        break;
      case "ending":
        slideComponent = <EndingSlide part={slidePart.part} />;
        break;

      default:
        throw new Error(
          "Could not map slide query param to component. This is an error in the codebase."
        );
    }

    return slideComponent;
  }

  function goToPrevSlide() {
    setIsNavigatingBackward(true);

    // To REALLY make sure the loading state of the button is showing, make sure
    // this is done completely asynchronously
    setTimeout(() => {
      if (prevSlide) {
        router.push({
          pathname: `/presentation/${id}`,
          query: {
            slide: prevSlide.slide,
            part: prevSlide.part,
          },
        });
      }
    }, 0);
  }

  function goToNextSlide() {
    setIsNavigatingForward(true);

    // To REALLY make sure the loading state of the button is showing, make sure
    // this is done completely asynchronously
    setTimeout(() => {
      if (nextSlide) {
        router.push({
          pathname: `/presentation/${id}`,
          query: {
            slide: nextSlide.slide,
            part: nextSlide.part,
          },
        });
      }
    }, 0);
  }

  return {
    isNavigatingBackward,
    isNavigatingForward,
    slideComponent: getSlideComponent(slide, part),
    goToPrevSlide,
    goToNextSlide,
    isFirstSlide: isFirstSlide(slide, part),
    isLastSlide: isLastSlide(slide, part),
  };
}
