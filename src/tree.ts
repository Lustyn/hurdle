import { AChar, IHurdle } from "./types";
import { setToArray, unique } from "./utils";

export interface IHurdleTreeNode {
    words: string[];
    children: Partial<Record<AChar, IHurdleTreeNode>>;
}

export const newHurdleTreeNode = (): IHurdleTreeNode => ({
    words: [],
    children: {}
});

export class HurdleTree implements IHurdle {
    constructor(
        public root: IHurdleTreeNode = newHurdleTreeNode(), 
        public readOnly: boolean = false
    ) {}

    // Inserts a word into the tree.
    insert(word: string): void {
        if (this.readOnly) throw new Error("Cannot insert into read-only tree.");

        let currentNode = this.root;
        const chars = setToArray(unique(word));
        for (const char of chars) {
            if (currentNode.children[char] === undefined)
                currentNode.children[char] = newHurdleTreeNode();
            currentNode = currentNode.children[char]!;
        }

        currentNode.words.push(word);
    }

    // Inserts many words into the tree.
    insertMany(words: string[]): void {
        for (const word of words)
            this.insert(word);
    }

    // Returns all words in the tree, sorted alphabetically.
    toArray(): string[] {
        const result: string[] = [];
        const search = (node: IHurdleTreeNode) => {
            if (node.words.length > 0)
                result.push(...node.words);

            for (const char in node.children)
                search(node.children[char as AChar]!);
        }

        search(this.root);
        return result.sort((a, b) => a.localeCompare(b));
    }

    // Returns the subtree of words which contain ALL characters in a set, at least once.
    includes(includes: Set<AChar>): HurdleTree {
        const traverse = (node: IHurdleTreeNode, charCount: number): IHurdleTreeNode => {
            const newNode = newHurdleTreeNode();
            newNode.words = charCount === includes.size ? node.words : [];

            for (const char in node.children) {
                const newCount = includes.has(char as AChar) ? charCount + 1 : charCount;
                newNode.children[char as AChar] = traverse(node.children[char as AChar]!, newCount);
            }

            return newNode;
        }

        return new HurdleTree(traverse(this.root, 0));
    }

    // Searches for words which contain ALL characters in a set, at least once.
    searchIncludes(includes: Set<AChar>): string[] {
        const subtree = this.includes(includes);
        return subtree.toArray();
    }

    // Searches for words which contain ONLY the characters in a set.
    searchIncludesOnly(includes: Set<AChar>): string[] {
        const lookup = setToArray(includes);

        // Lookup subtree
        let currentNode = this.root;
        for (const char of lookup) {
            if (currentNode.children[char] === undefined)
                return [];
            currentNode = currentNode.children[char]!;
        }

        return currentNode.words;
    }

    // Returns the subtree of words which do not contain ALL characters in a set.
    excludes(excludes: Set<AChar>): HurdleTree {
        const traverse = (node: IHurdleTreeNode): IHurdleTreeNode => {
            const newNode = newHurdleTreeNode();

            newNode.words = node.words;

            for (const char in node.children) {
                if (!excludes.has(char as AChar))
                    newNode.children[char as AChar] = traverse(node.children[char as AChar]!);
            }

            return newNode;
        }

        return new HurdleTree(traverse(this.root));
    }

    // Search for words which do not contain ALL of the characters in a set.
    searchExcludes(excludes: Set<AChar>): string[] {
        const result: string[] = [];

        const search = (node: IHurdleTreeNode) => {
            if (node.words.length > 0)
                result.push(...node.words);

            for (const char in node.children) {
                if (!excludes.has(char as AChar))
                    search(node.children[char as AChar]!);
            }
        }

        search(this.root);
        return result;
    }
}