import { hurdle, unique } from "../src/hurdle";
import { logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    // Construct a tree from the words in a json file
    const tree = await hurdle(WORDS_PATH);

    // You can use the subtree methods to query the tree in more advanced ways, 
    // and then retrieve all words in the subtree using the toArray() method.

    const words = tree.includes(unique("ab")) // Include all words containing the characters A and B
                      .excludes(unique("cd")) // Exclude all words containing the characters C and D
                      .toArray();             // Get all words in the subtree

    console.log(`The following words contain the characters A, B but not C, D:`);
    logTruncatedList(words, 10);
    console.assert(words.length === 492, "words.length must be 492");
};

main().catch(console.error);