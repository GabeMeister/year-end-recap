import { GetServerSidePropsResult } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import Button from "@/src/components/Button";
import { ALL_SLIDE_PARTS } from "@/src/utils/slides";
import db from "@/src/db/client";
import { getUrlPathWithQueryParams } from "@/src/utils/browser";

import usePresentationPage from "@/src/hooks/usePresentationPage";

type PresentationPageProps = {
  id: number;
  slide: string;
  part: string;
};

export default function PresentationPage({
  id,
  slide,
  part,
}: PresentationPageProps) {
  const {
    isNavigatingBackward,
    isNavigatingForward,
    slideComponent,
    goToPrevSlide,
    goToNextSlide,
  } = usePresentationPage({ id, slide, part });

  return (
    <>
      <Head>
        <title>Presentation | Year End Recap</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="PresentationPage p-6 bg-gray-800 h-screen w-screen flex justify-between items-center text-gray-300">
        <Button
          className="w-12"
          loading={isNavigatingBackward}
          onClick={goToPrevSlide}
        >
          <FontAwesomeIcon className="h-3 w-3" icon={faArrowLeft} />
        </Button>
        <div className="w-3/4 h-3/4 flex items-center justify-center ">
          {slideComponent}
        </div>
        <Button
          className="w-12"
          loading={isNavigatingForward}
          onClick={goToNextSlide}
        >
          <FontAwesomeIcon className="h-3 w-3" icon={faArrowRight} />
        </Button>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params,
  query,
}): Promise<GetServerSidePropsResult<PresentationPageProps>> {
  // Verify that the project exists
  const id = params.project_id;
  const slide = query?.slide ?? "";
  const part = query?.part ?? "";
  const allSlideParts = ALL_SLIDE_PARTS;

  if (
    !allSlideParts.find(
      (slidePart) => slidePart.slide === slide && slidePart.part === part
    )
  ) {
    return {
      redirect: {
        destination: getUrlPathWithQueryParams(`/presentation/${id}`, {
          slide: allSlideParts[0].slide,
          part: allSlideParts[0].part,
        }),
        permanent: false,
      },
    };
  }

  const rows = await db
    .selectFrom("repos")
    .select(["id"])
    .where("id", "=", id)
    .limit(1)
    .execute();

  if (rows.length !== 1) {
    // Requesting a repo that doesn't exist?? BANNED
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: rows[0].id,
      slide,
      part,
    },
  };
}
