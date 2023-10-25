import { clone } from "./utils/object";

const dog = { name: "dog" };
const dog2 = clone(dog);
console.log("\n\n***** dog2 *****\n", dog2, "\n\n");
