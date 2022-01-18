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
    root: IHurdleTreeNode;

    constructor(root: IHurdleTreeNode = newHurdleTreeNode()) {
        this.root = root;
    }

    // Inserts a word into the tree
    insert(word: string) {
        let currentNode = this.root;
        const chars = setToArray(unique(word));
        for (const char of chars) {
            if (currentNode.children[char] === undefined)
                currentNode.children[char] = newHurdleTreeNode();
            currentNode = currentNode.children[char]!;
        }

        currentNode.words.push(word);
    }

    // Inserts many words into the tree
    insertMany(words: string[]) {
        for (const word of words)
            this.insert(word);
    }

    // Searches for words which contain ONLY the characters in a given set
    searchIncludesOnly(includes: Set<AChar>) {
        const result: string[] = [];

        const search = (node: IHurdleTreeNode) => {
            if (node.words.length > 0)
                result.push(...node.words);

            for (const char of Object.keys(node.children)) {
                if (includes.has(char as AChar))
                    search(node.children[char as AChar]!);
            }
        }

        search(this.root);
        return result;
    }

    // Searches for words which contain ALL characters in a set, at least once
    searchIncludes(includes: Set<AChar>) {
        const lookup = setToArray(includes);

        // Lookup subtree
        let currentNode = this.root;
        for (const char of lookup) {
            if (currentNode.children[char] === undefined)
                return [];
            currentNode = currentNode.children[char]!;
        }

        // Search subtree
        const result: string[] = [];
        const search = (node: IHurdleTreeNode) => {
            if (node.words.length > 0)
                result.push(...node.words);

            for (const char of Object.keys(node.children)) 
                search(node.children[char as AChar]!);
        }

        search(currentNode);
        return result;
    }

    // Search for words which do not contain ALL of the characters in a given set
    searchExcludes(excludes: Set<AChar>) {
        const result: string[] = [];

        const search = (node: IHurdleTreeNode) => {
            if (node.words.length > 0)
                result.push(...node.words);

            for (const char of Object.keys(node.children)) {
                if (!excludes.has(char as AChar))
                    search(node.children[char as AChar]!);
            }
        }

        search(this.root);
        return result;
    }
}