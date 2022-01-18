import { setToArray, unique } from "../src/hurdle";
import { hurdle, logTruncatedList, WORDS_PATH } from "./utils";

async function main() {
    // Construct a tree from the words in a json file
    const tree = await hurdle(WORDS_PATH);

    // Create a Set of unique characters from the word "test"
    const includeChars = unique("test");

    // Get the subtree of words which contain ALL characters in the set
    const subtree = tree.includes(includeChars)

    // Get the words in the subtree
    const words = subtree.toArray();

    console.log(`The following words contain the characters ${setToArray(includeChars).join(", ")}:`);
    logTruncatedList(words, 10);
    console.assert(words.length === 486, "words.length must be 486");
};

main().catch(console.error);