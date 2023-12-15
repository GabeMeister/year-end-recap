import db from "@/src/db/client";
import {
  AuthorCommits,
  AuthorCommitsOverTime,
  AvgReleasesPerDay,
  Commit,
  CommitMessageLength,
  HighestCommitDaySummary,
  LineChangeStat,
  LinesOfCode,
  LongestFiles,
  MostReleasesInDay,
  StatsQuery,
  TeamAuthorData,
  TeamCommitData,
  TeamCommitsByHour,
  TeamCommitsByMonth,
  TeamCommitsByWeekDay,
} from "@/src/types/git";
import { sql } from "kysely";
import type { NextApiRequest, NextApiResponse } from "next";

function getQueryParams(req: NextApiRequest): StatsQuery {
  return {
    id: parseInt((req.query.id as string) ?? "0"),
    part: (req.query?.part as string) ?? "",
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, part } = getQueryParams(req);

  if (!id) {
    res.status(400).json({
      msg: `Must specify id in query params.`,
    });
    return;
  }

  if (!part) {
    res.status(400).json({
      msg: `Must specify part in query params.`,
    });
    return;
  }

  let data: any = null;

  switch (part) {
    case "teamCommits":
      data = await db
        .selectFrom("repos")
        .select(sql<TeamCommitData>`data->'teamCommits'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "newAuthors":
      data = await db
        .selectFrom("repos")
        .select(sql<TeamAuthorData>`data->'newAuthors'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "fileCount":
      data = await db
        .selectFrom("repos")
        .select(sql<Commit>`data->'fileCount'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "linesOfCode":
      data = await db
        .selectFrom("repos")
        .select(sql<LinesOfCode>`data->'linesOfCode'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "longestFiles":
      data = await db
        .selectFrom("repos")
        .select(sql<LongestFiles>`data->'longestFiles'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "authorCommitsOverTime":
      data = await db
        .selectFrom("repos")
        .select(
          sql<AuthorCommitsOverTime>`data->'authorCommitsOverTime'`.as("stats")
        )
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "allTimeAuthorCommits":
      data = await db
        .selectFrom("repos")
        .select(sql<AuthorCommits[]>`data->'allTimeAuthorCommits'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "teamCommitsByMonth":
      data = await db
        .selectFrom("repos")
        .select(sql<TeamCommitsByMonth>`data->'teamCommitsByMonth'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "teamCommitsByWeekDay":
      data = await db
        .selectFrom("repos")
        .select(
          sql<TeamCommitsByWeekDay>`data->'teamCommitsByWeekDay'`.as("stats")
        )
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "teamCommitsByHour":
      data = await db
        .selectFrom("repos")
        .select(sql<TeamCommitsByHour>`data->'teamCommitsByHour'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "highestCommitDayByAuthor":
      data = await db
        .selectFrom("repos")
        .select(
          sql<HighestCommitDaySummary>`data->'highestCommitDayByAuthor'`.as(
            "stats"
          )
        )
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "longestCommit":
      data = await db
        .selectFrom("repos")
        .select(sql<Commit>`data->'longestCommit'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "shortestCommits":
      data = await db
        .selectFrom("repos")
        .select(sql<Commit[]>`data->'shortestCommits'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "commitMessageLengths":
      data = await db
        .selectFrom("repos")
        .select(
          sql<CommitMessageLength[]>`data->'commitMessageLengths'`.as("stats")
        )
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "authorBlames":
      data = await db
        .selectFrom("repos")
        .select(sql<CommitMessageLength[]>`data->'authorBlames'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "avgReleasesPerDay":
      data = await db
        .selectFrom("repos")
        .select(sql<AvgReleasesPerDay>`data->'avgReleasesPerDay'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    case "mostReleasesInDay":
      data = await db
        .selectFrom("repos")
        .select(sql<MostReleasesInDay>`data->'mostReleasesInDay'`.as("stats"))
        .where("id", "=", id)
        .limit(1)
        .execute();
      break;
    default:
      res.status(400).json({
        msg: `Unrecognized part: ${part}`,
      });
      return;
  }

  if (data.length !== 1) {
    res.status(404).json({
      msg: `Could not find repo with id: ${id}`,
    });
    return;
  }

  res.status(200).json(data[0].stats);
}
