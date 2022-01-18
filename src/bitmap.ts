import { AChar, IHurdle } from "./types";
import { unique } from "./utils";

export const setToBits = (set: Set<AChar>): number => {
    let bits = 0;
    for (const char of set) {
        bits |= 1 << char.charCodeAt(0) - 'a'.charCodeAt(0);
    }
    return bits;
}
export const bitsToSet = (bits: number): Set<AChar> => {
    const newSet = new Set<AChar>();
    for (let i = 0; i < 26; i++) {
        if (bits & (1 << i)) {
            newSet.add(String.fromCharCode('a'.charCodeAt(0) + i) as AChar);
        }
    }
    return newSet;
}
export const notSet = (set: Set<AChar>): Set<AChar> => bitsToSet(~setToBits(set));

export class HurdleBitmap implements IHurdle {
    constructor(
        public readonly bitmaps: Map<number, string[]> = new Map()
    ) {}

    insert(word: string): void {
        const bits = setToBits(unique(word));
        const words = this.bitmaps.get(bits) || [];
        words.push(word);
        this.bitmaps.set(bits, words);
    }

    insertMany(words: string[]): void {
        for (const word of words)
            this.insert(word);
    }

    toArray(): string[] {
        const result: string[] = [];
        for (const [, words] of this.bitmaps) {
            result.push(...words);
        }
        return result;
    }

    query(includes: Set<AChar>, excludes: Set<AChar>): HurdleBitmap {
        const newMap = new Map<number, string[]>();
        const includeBits = setToBits(includes);
        const excludeBit = setToBits(excludes);

        for (const [bits, words] of this.bitmaps) {
            if ((bits & excludeBit) === 0 && (bits & includeBits) === includeBits) {
                newMap.set(bits, words);
            }
        }

        return new HurdleBitmap(newMap);
    }

    includes(chars: Set<AChar>): HurdleBitmap {
        return this.query(chars, new Set<AChar>());
    }

    searchIncludes(chars: Set<AChar>): string[] {
        return this.includes(chars).toArray();
    }

    searchIncludesOnly(chars: Set<AChar>): string[] {
        return this.query(chars, notSet(chars)).toArray();
    }

    excludes(chars: Set<AChar>): HurdleBitmap {
        return this.query(new Set<AChar>(), chars);
    }

    searchExcludes(chars: Set<AChar>): string[] {
        return this.excludes(chars).toArray();
    }
}