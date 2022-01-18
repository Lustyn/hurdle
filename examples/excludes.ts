import { hurdle, setToArray, unique } from "../src/hurdle";
import { logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    // Construct a tree from the words in a json file
    const tree = await hurdle(WORDS_PATH);

    // Create a Set of unique characters from the word "test"
    const excludeChars = unique("test");

    // Find words in the tree which do not contain ALL characters in the set
    const words = tree.searchExcludes(excludeChars)

    console.log(`The following words do not contain the characters ${setToArray(excludeChars).join(", ")}:`);
    logTruncatedList(words, 10);
};

main().catch(console.error);