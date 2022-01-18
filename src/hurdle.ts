const fs = require('fs/promises');
const exists = (file: string): Promise<boolean> => fs.access(file).then(
    () => true,
    () => false,
);

export type AChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' 
| 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' 
| 'y' | 'z';

export const setToArray = (set: Set<AChar>): AChar[] => [...set].sort();
export const arrayToSet = (arr: AChar[]): Set<AChar> => new Set<AChar>(arr);
export const unique = (word: string): Set<AChar> => arrayToSet(word.split('') as AChar[]);

export const hurdle = async (file: string): Promise<HurdleTree> => {
    const cachedPath = `${file}.hurdle`;

    if (await exists(cachedPath)) {
        console.log(`Loading cached tree from ${cachedPath}`);
        return new HurdleTree(JSON.parse(await fs.readFile(cachedPath, 'utf8')));
    } else {
        console.debug(`Loading words from ${file}`);
        const tree = new HurdleTree();
        const words = JSON.parse(await fs.readFile(file, 'utf8'));
        console.log(`Constructing tree...`);
        tree.insertMany(words);
        console.log(`Caching tree to ${cachedPath}`);
        await fs.writeFile(cachedPath, JSON.stringify(tree.root));
        return tree;
    }
}

export interface IHurdleTreeNode {
    words: string[];
    children: Partial<Record<AChar, IHurdleTreeNode>>;
}

export const newHurdleTreeNode = (): IHurdleTreeNode => ({
    words: [],
    children: {}
});

export class HurdleTree {
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
        const lookup = setToArray(includes);

        // Lookup subtree
        let currentNode = this.root;
        for (const char of lookup) {
            if (currentNode.children[char] === undefined) {
                currentNode = newHurdleTreeNode();
                break;
            }

            currentNode = currentNode.children[char]!;
        }

        return new HurdleTree(currentNode);
    }

    // Searches for words which contain ALL characters in a set, at least once.
    searchIncludes(includes: Set<AChar>): string[] {
        const subtree = this.includes(includes);
        return subtree.toArray();
    }

    // Searches for words which contain ONLY the characters in a set.
    searchIncludesOnly(includes: Set<AChar>): string[] {
        const subtree = this.includes(includes);
        return subtree.root.words;
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