import { unique } from "../src/hurdle";
import { hurdle, logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    const tree = await hurdle(WORDS_PATH);

    const testChars = unique("test");

    const words = tree.toArray();
    console.time("iter");
    let iterWords = [];
    for (const word of words) {
        const chars = unique(word);
        let count = 0;
        for (const char of chars) {
            if (testChars.has(char)) {
                count++;
            }
        }
        if (count === [...testChars].length) iterWords.push(word);
    }
    console.timeEnd("iter");

    console.time("subtree");
    const subtreeWords = tree.includes(testChars)
                             .toArray();
    console.timeEnd("subtree");

    console.time("query");
    const queryWords = tree.searchIncludes(testChars);
    console.timeEnd("query");

    console.assert(iterWords.length === queryWords.length, "iter and query word counts must match");
    console.assert(subtreeWords.length === queryWords.length, "subtree and query word counts must match");
};

main().catch(console.error);