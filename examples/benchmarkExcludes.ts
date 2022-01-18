import { hurdle, unique } from "../src/hurdle";
import * as fs from "fs/promises";
import { WORDS_PATH } from "./utils";

async function main() {
    const tree = await hurdle(WORDS_PATH);

    const testChars = unique("test");

    const words = JSON.parse(await fs.readFile(WORDS_PATH, "utf8"));
    console.time("iter");
    let iterWords = [];
    for (const word of words) {
        let match = true;
        for (const char of unique(word)) {
            if (testChars.has(char)) {
                match = false;
                break;
            }
        }
        if (match) iterWords.push(word);
    }
    console.timeEnd("iter");

    console.time("query");
    const queryWords = tree.searchExcludes(testChars)
    console.timeEnd("query");

    console.assert(iterWords.length === queryWords.length, "iter and query word counts must match");
};

main().catch(console.error);