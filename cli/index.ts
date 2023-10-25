import * as dotenv from "dotenv";
dotenv.config();
import { DB } from "../src/db/types"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";
import { Client } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
const db = new Kysely<DB>({
  dialect,
});

const FRONTEND_DIR = "/home/gabe/dev/rb-frontend";
const GIT_REPO_PATH = FRONTEND_DIR;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

async function select<T>(sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    client.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows as T);
      }
    });
  });
}

async function main() {
  const data = await db
    .selectFrom("signups")
    .select(sql<string>`count(*)`.as("count"))
    .where("email", "ilike", "%N%")
    .execute();
  console.log("\n\n***** data *****\n", parseInt(data[0].count), "\n\n");

  await db.destroy();
}

main();
