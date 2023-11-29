import { LinearClient } from "@linear/sdk";
import fs from "fs";

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

async function getAllIssues() {
  let issues;
  let endCursor;
  const allIssues: any[] = [];

  do {
    issues = await client.issues({
      first: 100,
      after: endCursor,
      includeArchived: true,
    });

    issues.nodes.forEach((issue) => {
      allIssues.push(issue);
    });

    endCursor = issues.pageInfo.endCursor;

    console.log(`Pulled ${allIssues.length} issues...`);
  } while (issues.pageInfo.hasNextPage);

  fs.writeFileSync("./linear-issues.json", JSON.stringify(allIssues));
}

async function task() {
  try {
    await getAllIssues();
  } catch (e) {
    console.log(`\nERROR HAPPENED\n`);
    console.error(e);
  }

  console.log("\n\nDone!");
}

export default task;
