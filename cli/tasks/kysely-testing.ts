import db from "../../src/db/client";

export async function testKysely() {
  /*
   * INSERT
   */
  // const result = await db
  //   .insertInto("repos")
  //   .values({
  //     name: "React.js",
  //     url: "https://github.com/facebook/react",
  //     ssh_url: "git@github.com:facebook/react.git",
  //     created_date: new Date(Date.now()),
  //     updated_date: new Date(Date.now()),
  //     data: { animal: "cat" },
  //   })
  //   .executeTakeFirst();

  // console.log("\n\n***** result *****\n", result, "\n\n");

  /*
   * SELECT
   */
  const result = await db
    .selectFrom("repos")
    .select(["id", "name"])
    .where("name", "ilike", "react%")
    .execute();
  console.log("\n\n***** result *****\n", result, "\n\n");

  /*
   * UPDATE
   */
  // const result = await db
  //   .updateTable("repos")
  //   .set({
  //     data: { version: 1 },
  //   })
  //   .execute();
  // console.log("\n\n***** result *****\n", result, "\n\n");

  /*
   * DELETE
   */
  // const result = await db.deleteFrom("repos").where("id", "=", 1).execute();
  // console.log("\n\n***** result *****\n", result[0].numDeletedRows, "\n\n");
}
