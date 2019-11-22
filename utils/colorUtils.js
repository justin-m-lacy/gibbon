/**
 * Returns a color string in the form of 'RRGGBB'
 * @param {number} color
 * @returns {string}
 */
export const rgbStr =(color)=>{
	return color.toString(16).padStart(6,'0');
};

/**
 * Returns a color string in the form of '#RRGGBB'
 * @param {number} color
 * @returns {string}
 */
export const htmlStr =(color)=>{
	return '#'+color.toString(16).padStart(6,'0');
};

/**
 * Interpolates two numeric colors into a third
 * color.
 * @param {number} col1
 * @param {number} col2
 * @param {number} t
 * @returns {number}
 */
export const lerpColor = (col1, col2, t) =>{

	let s = 1 - t;
	let r = Math.floor( s*(col1>>16) + t*(col2>>16) );
	let g = Math.floor(s*( (0xff00&col1)>>8 ) + t*( (0xff00&col2)>>8));
	let b = Math.floor( s*(0xff&col1) + t*( (0xff&col2)) );

	return (r<<16) + (g<<8) + b;

}