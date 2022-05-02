/**
 * Splices an element from the array by replacing it
 * with the last element.
 * Array order is not preserved.
 * If used in a loop, the loop must count down from the last element.
 * @param {number[]} a
 * @param {number} i
*/
export declare const quickSplice: <T>(a: T[], i: number) => void;
export declare const randElm: <T>(a: T[]) => T | undefined;
/**
 * Removes element from array, if it exists.
 */
export declare const remove: <T>(a: T[], e: T) => void;
export declare const contains: <T>(a: T[], e: T) => boolean;
