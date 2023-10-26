import * as dotenv from "dotenv";
dotenv.config();
import task from "./tasks/calculate-git-stats";

async function main() {
  task();
}

main();
