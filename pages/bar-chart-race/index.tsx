import db from "@/src/db/client";
import { sql } from "kysely";
import data from "@/src/data/commits_over_time.json";
import dynamic from "next/dynamic";
import { AuthorCommitsOverTime } from "@/src/types/git";
const BarChartRacePage = dynamic(
  () => import("../../src/components/page-views/BarChartRacePage"),
  { ssr: false }
);

const BarChartRace = ({ commitsOverTime }) => (
  <BarChartRacePage commitsOverTime={commitsOverTime} />
);

export default BarChartRace;

export async function getServerSideProps({ query }) {
  const repo = query?.repo ?? "RedBalloon Frontend";

  const rows = await db
    .selectFrom("repos")
    .select(
      sql<AuthorCommitsOverTime>`data->'authorCommitsOverTime'`.as(
        "author_commits_over_time"
      )
    )
    .where("name", "ilike", `%${repo}%`)
    .limit(1)
    .execute();

  const commitsOverTime = rows[0].author_commits_over_time.filter(
    (c) => parseInt(c.value) >= 10
  );

  return {
    props: {
      commitsOverTime,
    },
  };
}
