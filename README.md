# hurdle
A small library that implements a tree structure for storing and querying case-insensitive word lists from games like Wordle.

## `hurdle.hurdle`
    hurdle(path: string): Promise<HurdleTree>

Loads a JSON array of words from `path` and returns a `HurdleTree` object. This will cache a copy of the constructed tree to `${path}.hurdle` if one does not already exist, and reload it in subsequent calls.

## `HurdleTree.constructor`
    constructor(root?: IHurdleTreeNode): HurdleTree

Constructs a new `HurdleTree`, optionally passing in the root node if you want to start with a pre-existing tree.

## `HurdleTree.insert`
    insert(word: string): void

Inserts a word into the tree.

## `HurdleTree.insertMany`
    insertMany(words: string[]): void

Inserts many words into the tree.

## `HurdleTree.searchIncludes`
    searchIncludes(includes: Set<AChar>): string[]

Searches the tree for words that include ALL the characters in the given set at least once.

## `HurdleTree.searchIncludesOnly`
    searchIncludesOnly(includes: Set<AChar>): string[]

Searches the tree for words that include ONLY the characters in the given set.

## `HurdleTree.searchExcludes`
    searchExcludes(excludes: Set<AChar>): string[]

Searches the tree for words that exclude all the characters in the given set.