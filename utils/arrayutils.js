	/**
	 * Splices an element from the array by replacing it
	 * with the last element.
	 * Array order is not preserved.
	 * If used in a loop, the loop must count down from the last element.
	 * @param {Array} a 
	 * @param {number} i 
	*/
	export const quickSplice = ( a, i ) => {
		a[i] = a[ a.length-1 ];
		a.pop();
	}