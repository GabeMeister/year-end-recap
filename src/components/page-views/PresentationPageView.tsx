import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import Button from "@/src/components/Button";
import { isMobile } from "@/src/utils/browser";
import usePresentationPage from "@/src/hooks/usePresentationPage";
import MobileWarningPage from "./MobileWarningPage";

type PresentationPageViewProps = {
  id: number;
  slide: string;
  part: string;
};

export default function PresentationPageView({
  id,
  slide,
  part,
}: PresentationPageViewProps) {
  const {
    isNavigatingBackward,
    isNavigatingForward,
    slideComponent,
    goToPrevSlide,
    goToNextSlide,
    isFirstSlide,
    isLastSlide,
  } = usePresentationPage({ id, slide, part });

  if (isMobile()) {
    return <MobileWarningPage />;
  }

  return (
    <>
      <Head>
        <title>Presentation | Year End Recap</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="PresentationPage p-6 bg-gray-800 h-screen w-screen flex justify-between items-center text-gray-300">
        <Button
          className={`w-12 ${isFirstSlide ? "invisible" : "block"}`}
          loading={isNavigatingBackward}
          onClick={goToPrevSlide}
        >
          <FontAwesomeIcon className="h-3 w-3" icon={faArrowLeft} />
        </Button>
        <div className="w-3/4 h-3/4 flex items-center justify-center ">
          {slideComponent}
        </div>
        <Button
          className={`w-12 ${isLastSlide ? "invisible" : "block"}`}
          loading={isNavigatingForward}
          onClick={goToNextSlide}
        >
          <FontAwesomeIcon className="h-3 w-3" icon={faArrowRight} />
        </Button>
      </div>
    </>
  );
}
