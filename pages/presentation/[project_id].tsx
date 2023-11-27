import { GetServerSidePropsResult } from "next";
import { ALL_SLIDE_PARTS } from "@/src/utils/slides";
import db from "@/src/db/client";
import { getUrlPathWithQueryParams } from "@/src/utils/browser";
import dynamic from "next/dynamic";
const PresentationPageView = dynamic(
  () => import("@/src/components/page-views/PresentationPageView"),
  { ssr: false }
);

type PresentationPageProps = {
  id: number;
  slide: string;
  part: string;
};

export default function PresentationPage(props: PresentationPageProps) {
  return <PresentationPageView {...props} />;
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
