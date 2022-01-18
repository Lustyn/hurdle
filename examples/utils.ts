import path from "path";
import { HurdleBitmap } from "../src/bitmap";
import { IHurdle } from "../src/types";
import * as fs from "fs/promises";

export const WORDS_PATH = path.join(__dirname, "wordle_words.json");

export async function hurdle(path: string): Promise<IHurdle> {
    const bitmap = new HurdleBitmap();
    const words = JSON.parse(await fs.readFile(path, "utf8"));
    bitmap.insertMany(words);
    return bitmap;
}

export function logTruncatedList(words: string[], truncateAmount: number) {
    const amountTruncated = words.length - truncateAmount;
    const truncatedWords = words.slice(0, truncateAmount);
    console.log(truncatedWords.join(", "));
    if (amountTruncated > 0)
        console.log(`... and ${amountTruncated} more (${words.length} total)`);
}