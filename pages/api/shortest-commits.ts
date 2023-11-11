import db from "@/src/db/client";
import { ShortestCommitsQuery } from "@/src/hooks/endpoints/useShortestCommits";
import { NotFoundResponse } from "@/src/types/endpoints";
import { Commit } from "@/src/types/git";
import { sql } from "kysely";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Commit[] | NotFoundResponse>
) {
  const query: ShortestCommitsQuery =
    req.query as unknown as ShortestCommitsQuery;
  const data = await db
    .selectFrom("repos")
    .select(sql<Commit[]>`data->'shortestCommits'`.as("shortest_commits"))
    .where("id", "=", query.id)
    .limit(1)
    .execute();

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo of id ${query.id}`,
    });
    return;
  }

  res.status(200).json(data[0].shortest_commits);
}
