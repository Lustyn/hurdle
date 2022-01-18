import { hurdle, unique } from "../src/hurdle";
import { WORDS_PATH } from "./utils";

async function main() {
    const tree = await hurdle(WORDS_PATH);

    const testChars = unique("test");

    const words = tree.toArray();
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

    console.time("subtree");
    const subtreeWords = tree.excludes(testChars)
                             .toArray();
    console.timeEnd("subtree");

    console.time("query");
    const queryWords = tree.searchExcludes(testChars);
    console.timeEnd("query");

    console.assert(iterWords.length === queryWords.length, "iter and query word counts must match");
    console.assert(subtreeWords.length === queryWords.length, "subtree and query word counts must match");
};

main().catch(console.error);