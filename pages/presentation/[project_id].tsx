import { GetServerSidePropsResult } from "next";
import Head from "next/head";
import Button from "@/src/components/Button";
import { ALL_SLIDES } from "@/src/utils/constants";
import db from "@/src/db/client";
import { getUrlPathWithQueryParams } from "@/src/utils/browser";

import usePresentationPage from "@/src/hooks/usePresentationPage";

type PresentationPageProps = {
  id: number;
  slide: string;
};

export default function PresentationPage({ id, slide }: PresentationPageProps) {
  const {
    isNavigatingBackward,
    isNavigatingForward,
    slideComponent,
    goToPrevSlide,
    goToNextSlide,
  } = usePresentationPage({ id, slide });

  return (
    <>
      <Head>
        <title>Presentation | Year End Recap</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="PresentationPage p-6 bg-gray-800 h-screen w-screen flex justify-between items-center text-gray-300">
        <Button
          loading={isNavigatingBackward}
          onClick={goToPrevSlide}
        >{`< Back`}</Button>
        <div className="w-3/4 h-3/4 flex items-center justify-center ">
          {slideComponent}
        </div>
        <Button
          loading={isNavigatingForward}
          onClick={goToNextSlide}
        >{`Forward >`}</Button>
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

  if (!ALL_SLIDES.includes(slide)) {
    return {
      redirect: {
        destination: getUrlPathWithQueryParams(`/presentation/${id}`, {
          slide: "about",
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
    },
  };
}
