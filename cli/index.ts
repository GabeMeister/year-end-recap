import * as dotenv from "dotenv";
dotenv.config();
import task from "./tasks/calculate-git-stats";
// import task from "./tasks/linear-stats";

async function main() {
  task();
}

main();
