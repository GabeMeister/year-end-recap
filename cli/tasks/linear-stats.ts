import { LinearClient } from "@linear/sdk";
import fs from "fs";

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

function objectToArr(obj: Record<string, any>) {
  const arr = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));

  return arr;
}

function addToMap(map: Record<string, number>, key: string, value: number) {
  if (!map[key]) {
    map[key] = value;
  } else {
    map[key] = map[key] + value;
  }
}

// id => email
type LinearUserMap = Record<string, string>;

async function fetchAllUsers(): Promise<LinearUserMap> {
  const data = await client.users();
  const users: LinearUserMap = {};

  data.nodes.forEach((u) => {
    users[u.id] = u.email;
  });

  users["00da1949-bb5e-4668-9753-76bc197b7508"] = "clive@redballoon.work";
  users["ca927702-3286-4cba-92f9-bb65e52b84cf"] = "chaz@redballoon.work";

  return users;
}

type LinearProject = {
  id: string;
  slugId: string;
  name: string;
  url: string;
};

async function fetchAllProjects(): Promise<LinearProject[]> {
  const data = await client.projects({
    includeArchived: true,
  });

  const allProjects: LinearProject[] = [];

  data.nodes.forEach((proj) => {
    allProjects.push({
      id: proj.id,
      slugId: proj.slugId,
      name: proj.name,
      url: proj.url,
    });
  });

  console.log("\n\n***** allProjects *****\n", allProjects, "\n\n");

  return allProjects;
}

async function fetchAllIssues() {
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

  fs.writeFileSync("./linear-issues.json", JSON.stringify(allIssues, null, 2));
}

async function processCreators() {
  const users = await fetchAllUsers();

  const allIssues: any[] = JSON.parse(
    fs.readFileSync("./linear-issues.json", "utf8")
  );
  const completedIssues = allIssues.filter((issue) => !!issue.completedAt);

  const creatorCounts = completedIssues.reduce((acc, curr) => {
    if (!curr._creator.id) {
      return acc;
    }

    if (!users[curr._creator.id]) {
      console.log(users, curr._creator.id, curr.identifier);
    }

    if (!acc[users[curr._creator.id]]) {
      acc[users[curr._creator.id]] = 1;
    } else {
      acc[users[curr._creator.id]] = acc[users[curr._creator.id]] + 1;
    }

    return acc;
  }, {});

  console.log("\n\n***** creatorCounts *****\n", creatorCounts, "\n\n");

  return creatorCounts;
}

async function processLOE() {
  const users = await fetchAllUsers();

  const allIssues: any[] = JSON.parse(
    fs.readFileSync("./linear-issues.json", "utf8")
  );
  const completedIssues = allIssues.filter((issue) => !!issue.completedAt);

  const totalLOE = completedIssues.reduce((acc, curr) => {
    return acc + (curr?.estimate ?? 0);
  }, 0);

  console.log("\n\n***** totalLOE *****\n", totalLOE, "\n\n");

  const issueLOECounts: Record<string, number> = {};
  const loeBuckets = completedIssues.reduce((acc, curr) => {
    addToMap(acc, curr?.estimate ?? 0, 1);

    return acc;
  }, issueLOECounts);

  const bucketArr = objectToArr(loeBuckets);

  console.log("\n\n***** bucketArr *****\n", bucketArr, "\n\n");

  bucketArr.forEach((b) => {
    console.log(`${b.key}\t${b.value}`);
  });

  const avgLOE = totalLOE / completedIssues.length;
  console.log("\n\n***** avgLOE *****\n", avgLOE, "\n\n");

  const incompleteIssues = allIssues.filter(
    (issue) => !issue.completedAt && !issue.canceledAt
  );
  incompleteIssues.sort((a, b) => {
    if (new Date(a.createdAt) > new Date(b.createdAt)) {
      return -1;
    } else if (new Date(a.createdAt) < new Date(b.createdAt)) {
      return 1;
    } else {
      return 0;
    }
  });
  incompleteIssues.forEach((issue) => {
    console.log(
      "\n\n***** issue.createdAt *****\n",
      issue.createdAt,
      issue.title,
      issue.identifier,
      "\n\n"
    );
  });

  return;
}

async function processLargestProjects() {
  const allProjects = await fetchAllProjects();

  const allIssues: any[] = JSON.parse(
    fs.readFileSync("./linear-issues.json", "utf8")
  );
  const completedIssues = allIssues.filter((issue) => !!issue.completedAt);

  const projToIssueCountMap: Record<string, number> = {};

  completedIssues.forEach((issue) => {
    const projId = issue?._project?.id ?? "<blank>";
    console.log(issue.title, projId);

    addToMap(projToIssueCountMap, projId, issue?.estimate ?? 0);
  });

  console.log(
    "\n\n***** projToIssueCountMap *****\n",
    projToIssueCountMap,
    "\n\n"
  );

  const projLOECounts: { name: string; count: number }[] = [];

  for (let projId of Object.keys(projToIssueCountMap)) {
    const count = projToIssueCountMap[projId];
    const projName =
      allProjects.find((p) => p.id === projId)?.name ?? "<blank>";

    projLOECounts.push({ name: projName, count });
  }

  projLOECounts.sort((a, b) => b.count - a.count);

  console.log(
    "\n\n***** projNameToIssueCountMap *****\n",
    projLOECounts,
    "\n\n"
  );
}

async function processMostDetailedIssue() {
  const allIssues: any[] = JSON.parse(
    fs.readFileSync("./linear-issues.json", "utf8")
  );
  const completedIssues = allIssues.filter((issue) => !!issue.completedAt);

  completedIssues.sort(
    (a, b) => (b?.description?.length ?? 0) - (a?.description?.length ?? 0)
  );

  console.log("\n\n***** completedIssues *****\n", completedIssues, "\n\n");
}

async function task() {
  try {
    // await processMostDetailedIssue();
    // await processLargestProjects();
    // await fetchAllProjects();
    await processLOE();
    // await processCreators();
    // await fetchAllUsers();
    // await fetchAllIssues();
  } catch (e) {
    console.log(`\nERROR HAPPENED\n`);
    console.error(e);
  }

  console.log("\n\nDone!");
}

export default task;
