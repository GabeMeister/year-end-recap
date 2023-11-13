import db from "@/src/db/client";
import { TeamCommitsQuery } from "@/src/hooks/endpoints/useTeamCommits";
import { NotFoundResponse } from "@/src/types/endpoints";
import { TeamCommitData } from "@/src/types/git";
import { sql } from "kysely";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeamCommitData | NotFoundResponse>
) {
  const query: TeamCommitsQuery = req.query as unknown as TeamCommitsQuery;
  const data = await db
    .selectFrom("repos")
    .select(sql<TeamCommitData>`data->'teamCommits'`.as("team_commits"))
    .where("id", "=", query.id)
    .limit(1)
    .execute();

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo of id ${query.id}`,
    });
    return;
  }

  res.status(200).json(data[0].team_commits);
}
