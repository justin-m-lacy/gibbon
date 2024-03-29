/**
 * Add elements of b to target when not already
 * in the array.
 * @param target
 * @param b 
 */
export const addUnique = <T>(target: T[], b: T[]) => {

	for (let i = b.length - 1; i >= 0; i--) {

		if (target.indexOf(b[i]) < 0) {
			target.push(b[i]);
		}
	}

}


/**
 * Splices an element from the array by replacing it
 * with the last element.
 * Array order is not preserved.
 * If used in a loop, the loop must count down from the last element.
 * @param {number[]} a
 * @param {number} i
*/
export const quickSplice = <T>(a: T[], i: number) => {
	a[i] = a[a.length - 1];
	a.pop();
}

/**
 * @returns Random element from an array. 
 */
export const randElm = <T>(a: T[]): T | undefined => {

	if (a.length > 0) {
		return a[Math.floor(Math.random() * a.length)];
	}
}

/**
 * Removes element from array, if it exists.
 */
export const remove = <T>(a: T[], e: T) => {
	const i = a.indexOf(e);
	if (i >= 0) {
		a.splice(i, 1);
	}
}

/**
 * @returns True if array contains element.
 */
export const contains = <T>(a: T[], e: T) => {
	for (let i = a.length - 1; i >= 0; i--) {
		if (a[i] === e) {
			return true;
		}
	}
	return false;
}