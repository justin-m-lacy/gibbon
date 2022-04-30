/**
 * Returns a color string in the form of 'RRGGBB'
 * @param {number} color
 * @returns {string}
 */
export declare const rgbStr: (color: number) => string;
/**
 * Returns a color string in the form of '#RRGGBB'
 * @param {number} color
 * @returns {string}
 */
export declare const htmlStr: (color: number) => string;
/**
 * Interpolates two numeric colors into a third
 * color.
 * @param {number} col1
 * @param {number} col2
 * @param {number} t
 * @returns {number}
 */
export declare const lerpColor: (col1: number, col2: number, t: number) => number;
