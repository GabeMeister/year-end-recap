import Button from "@/src/components/Button";
import AboutSlide from "@/src/components/slides/AboutSlide";
import LongestCommitSlide from "@/src/components/slides/LongestCommitSlide";
import ShortestCommitsSlide from "@/src/components/slides/ShortestCommitsSlide";
import { ALL_SLIDES } from "@/src/types/slides";
import db from "@/src/db/client";
import { GetServerSidePropsResult } from "next";
import Head from "next/head";
import { getUrlPathWithQueryParams } from "@/src/utils/browser";
import { getNextSlide, getPrevSlide } from "@/src/utils/slides";
import { useRouter } from "next/router";

type PresentationPageProps = {
  id: number;
  slide: string;
};

export default function PresentationPage({ id, slide }: PresentationPageProps) {
  const router = useRouter();
  const nextSlide = getNextSlide(slide);
  const prevSlide = getPrevSlide(slide);
  let slideComponent: JSX.Element = <></>;

  switch (slide) {
    case "about":
      slideComponent = <AboutSlide />;
      break;
    case "longest_commit":
      slideComponent = <LongestCommitSlide />;
      break;
    case "shortest_commit":
      slideComponent = <ShortestCommitsSlide />;
      break;
    default:
      throw new Error("Slide is not found. This should not have happened.");
  }

  function goToPrevSlide() {
    router.push({
      pathname: `/presentation/${id}`,
      query: {
        slide: prevSlide,
      },
    });
  }

  function goToNextSlide() {
    router.push({
      pathname: `/presentation/${id}`,
      query: {
        slide: nextSlide,
      },
    });
  }

  return (
    <>
      <Head>
        <title>Presentation | Year End Recap</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="PresentationPage p-6 bg-gray-800 h-screen w-screen flex justify-between items-center text-gray-300">
        <Button onClick={goToPrevSlide}>{`< Back`}</Button>
        <div className="w-3/4 h-3/4 flex items-center justify-center ">
          {slideComponent}
        </div>
        <Button onClick={goToNextSlide}>{`Forward >`}</Button>
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
