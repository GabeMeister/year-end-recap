import db from "@/src/db/client";
import {
  AboutRepoQuery,
  AboutRepoResponse,
} from "@/src/hooks/endpoints/useAboutRepo";
import { NotFoundResponse } from "@/src/types/endpoints";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AboutRepoResponse | NotFoundResponse>
) {
  const query: AboutRepoQuery = req.query as unknown as AboutRepoQuery;
  const data = await db
    .selectFrom("repos")
    .select(["name", "repos.created_date"])
    .where("id", "=", query.id)
    .limit(1)
    .execute();

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo of id ${query.id}`,
    });
    return;
  }

  res.status(200).json(data[0]);
}
