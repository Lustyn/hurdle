# hurdle
A small library that implements a tree structure for storing and querying case-insensitive word lists from games like Wordle.

## Usage
Examples can be found in the [examples](/examples) directory.

## `HurdleBitmap.constructor`
    constructor(bitmaps?: Map<number, string[]>): HurdleBitmap

Constructs a new `HurdleBitmap`, optionally passing in the bitmaps if you want to use a pre-existing bitmap. This is the fastest data structure to use for querying.

## `HurdleTree.constructor`
    constructor(root?: IHurdleTreeNode, readOnly?: boolean): HurdleTree

Constructs a new `HurdleTree`, optionally passing in the root node if you want to start with a pre-existing tree. `readOnly` defaults to `false` and can be set to `true` to prevent `insert` from being used on the tree. This is the slower data structure to use for querying.

## `IHurdle.insert`
    insert(word: string): void

Inserts a word into the dataset.

## `IHurdle.insertMany`
    insertMany(words: string[]): void

Inserts many words into the dataset.

## `IHurdle.includes`
    includes(includes: Set<AChar>): IHurdle

Returns the subset of words that include ALL the characters in the given set at least once.

## `IHurdle.searchIncludes`
    searchIncludes(includes: Set<AChar>): string[]

Searches the set for words that include ALL the characters in the given set at least once.

## `IHurdle.searchIncludesOnly`
    searchIncludesOnly(includes: Set<AChar>): string[]

Searches the set for words that include ONLY the characters in the given set.

## `IHurdle.excludes`
    excludes(excludes: Set<AChar>): IHurdle

Returns the subset of words that exclude ALL the characters in the given set. **NOTE**: to avoid mutation, this copies the tree. For faster query time, use `IHurdle.searchExcludes`.

## `IHurdle.searchExcludes`
    searchExcludes(excludes: Set<AChar>): string[]

Searches the set for words that exclude ALL the characters in the given set.