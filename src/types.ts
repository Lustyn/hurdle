export type AChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' 
| 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' 
| 'y' | 'z';

export interface IHurdle {
    insert(word: string): void;
    insertMany(words: string[]): void;
    toArray(): string[];
    searchIncludes(chars: Set<AChar>): string[];
    searchIncludesOnly(chars: Set<AChar>): string[];
    includes(chars: Set<AChar>): IHurdle;
    searchExcludes(chars: Set<AChar>): string[];
    excludes(chars: Set<AChar>): IHurdle;
}