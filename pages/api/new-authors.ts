import db from "@/src/db/client";
import { NewAuthorsQuery } from "@/src/hooks/endpoints/useNewAuthors";
import { NotFoundResponse } from "@/src/types/endpoints";
import { TeamAuthorData } from "@/src/types/git";
import { sql } from "kysely";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeamAuthorData | NotFoundResponse>
) {
  const query: NewAuthorsQuery = req.query as unknown as NewAuthorsQuery;
  const data = await db
    .selectFrom("repos")
    .select(sql<TeamAuthorData>`data->'newAuthors'`.as("new_authors"))
    .where("id", "=", query.id)
    .limit(1)
    .execute();

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo of id ${query.id}`,
    });
    return;
  }

  res.status(200).json(data[0].new_authors);
}
