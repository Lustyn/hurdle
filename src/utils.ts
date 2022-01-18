import { AChar } from "./types";

export const setToArray = (set: Set<AChar>): AChar[] => [...set].sort();
export const arrayToSet = (arr: AChar[]): Set<AChar> => new Set<AChar>(arr);
export const unique = (word: string): Set<AChar> => arrayToSet(word.split('') as AChar[]);