import BarChartPage from "@/src/components/page-views/BarChartPage";
import db from "@/src/db/client";
import { RepoRecap } from "@/src/types/git";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function BarChart({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(repo);

  return <BarChartPage commits={repo.allTimeAuthorCommits.slice(0, 15)} />;
}

export const getServerSideProps = (async ({ query }) => {
  const repoName = query?.repo ?? "RedBalloon Frontend";
  console.log("\n\n***** repoName *****\n", repoName, "\n\n");

  const rows = await db
    .selectFrom("repos")
    .select(["name", "data"])
    .where("name", "ilike", `%${repoName}%`)
    .execute();
  const repo = rows[0];

  return { props: { repo: repo.data as RepoRecap } };
}) satisfies GetServerSideProps<{
  repo: RepoRecap;
}>;
