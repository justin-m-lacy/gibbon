/**
 * Splices an element from the array by replacing it
 * with the last element.
 * Array order is not preserved.
 * If used in a loop, the loop must count down from the last element.
 * @param {number[]} a
 * @param {number} i
*/
export const quickSplice = (a: number[], i: number) => {
	a[i] = a[a.length - 1];
	a.pop();
}

export const randElm = (a: number[]): number => {
	return a[Math.floor(Math.random() * a.length)];
}