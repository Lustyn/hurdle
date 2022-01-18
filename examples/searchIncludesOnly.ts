import { hurdle, setToArray, unique } from "../src/hurdle";
import { logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    // Construct a tree from the words in a json file
    const tree = await hurdle(WORDS_PATH);

    // Create a Set of unique characters from the word "test"
    const includeChars = unique("test");

    // Find words in the tree which contain ONLY characters in the set
    const words = tree.searchIncludesOnly(includeChars)

    console.log(`The following words contain ONLY the characters ${setToArray(includeChars).join(", ")}:`);
    logTruncatedList(words, 10);
    console.assert(words.length === 5, "words.length must be 5");
};

main().catch(console.error);