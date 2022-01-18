# hurdle
A small library that implements a tree structure for storing and querying case-insensitive word lists from games like Wordle.

## Usage
Examples can be found in the [examples](/examples) directory.

## `hurdle.hurdle`
    hurdle(path: string): Promise<HurdleTree>

Loads a JSON array of words from `path` and returns a `HurdleTree` object. This will cache a copy of the constructed tree to `${path}.hurdle` if one does not already exist, and reload it in subsequent calls.

## `HurdleTree.constructor`
    constructor(root?: IHurdleTreeNode, readOnly?: boolean): HurdleTree

Constructs a new `HurdleTree`, optionally passing in the root node if you want to start with a pre-existing tree. `readOnly` defaults to `false` and can be set to `true` to prevent `insert` from being used on the tree.

## `HurdleTree.insert`
    insert(word: string): void

Inserts a word into the tree.

## `HurdleTree.insertMany`
    insertMany(words: string[]): void

Inserts many words into the tree.

## `HurdleTree.includes`
    includes(includes: Set<AChar>): HurdleTree

Returns the subtree of words that include ALL the characters in the given set at least once.

## `HurdleTree.searchIncludes`
    searchIncludes(includes: Set<AChar>): string[]

Searches the tree for words that include ALL the characters in the given set at least once.

## `HurdleTree.searchIncludesOnly`
    searchIncludesOnly(includes: Set<AChar>): string[]

Searches the tree for words that include ONLY the characters in the given set.

## `HurdleTree.excludes`
    excludes(excludes: Set<AChar>): HurdleTree

Returns the subtree of words that exclude ALL the characters in the given set. **NOTE**: to avoid mutation, this copies the tree. For faster query time, use `HurdleTree.excludes`.

## `HurdleTree.searchExcludes`
    searchExcludes(excludes: Set<AChar>): string[]

Searches the tree for words that exclude ALL the characters in the given set.