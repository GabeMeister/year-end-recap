"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testKysely = void 0;
const client_1 = __importDefault(require("../../src/db/client"));
function testKysely() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield client_1.default
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
    });
}
exports.testKysely = testKysely;
