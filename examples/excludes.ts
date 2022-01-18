import { setToArray, unique } from "../src/hurdle";
import { hurdle, logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    // Construct a tree from the words in a json file
    const tree = await hurdle(WORDS_PATH);

    // Create a Set of unique characters from the word "test"
    const excludeChars = unique("test");

    // Get the subtree of words which do not contain ALL characters in the set
    const subtree = tree.excludes(excludeChars)

    // Get the words in the subtree
    const words = subtree.toArray();

    console.log(`The following words do not contain the characters ${setToArray(excludeChars).join(", ")}:`);
    logTruncatedList(words, 10);
    console.assert(words.length === 2725, "words.length must be 2725");
};

main().catch(console.error);