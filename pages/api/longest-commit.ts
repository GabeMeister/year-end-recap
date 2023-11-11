import db from "@/src/db/client";
import { LongestCommitQuery } from "@/src/hooks/endpoints/useLongestCommit";
import { NotFoundResponse } from "@/src/types/endpoints";
import { Commit } from "@/src/types/git";
import { sql } from "kysely";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Commit | NotFoundResponse>
) {
  const query: LongestCommitQuery = req.query as unknown as LongestCommitQuery;
  const data = await db
    .selectFrom("repos")
    .select(sql<Commit>`data->'longestCommit'`.as("longest_commit"))
    .where("id", "=", query.id)
    .limit(1)
    .execute();

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo of id ${query.id}`,
    });
    return;
  }

  res.status(200).json(data[0].longest_commit);
}
