export default {


	/**
	 * @returns {number} random integer in min,max inclusive
	 */
	randInt:(min,max)=>{ return min + Math.floor( Math.random()*(max+1-min)) },

	randRange:(min,max)=>{ return min + ( Math.random()*(max-min)) }

}