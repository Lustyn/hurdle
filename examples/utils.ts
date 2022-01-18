import path from "path";

export const WORDS_PATH = path.join(__dirname, "wordle_words.json");

export function logTruncatedList(words: string[], truncateAmount: number) {
    const amountTruncated = words.length - truncateAmount;
    const truncatedWords = words.slice(0, truncateAmount);
    console.log(truncatedWords.join(", "));
    if (amountTruncated > 0)
        console.log(`... and ${amountTruncated} more`);
}