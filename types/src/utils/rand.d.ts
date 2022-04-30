import { Point, Polygon, Rectangle } from "pixi.js";
/**
 * Return random point in Rectangle.
 * @param {Rectangle} r
 * @returns {Point}
 */
export declare const randInRect: (r: Rectangle) => Point;
/**
* @returns {number} random integer in min,max inclusive
*/
export declare const randInt: (min: number, max: number) => number;
export declare const randRange: (min: number, max: number) => number;
/**
* Create random polygon centered on 0,0.
* @param {number} minPoints
* @param {number} maxPoints
* @param {number} minRadius
* @param {number} maxRadius
* @returns {PIXI.Polygon}
*/
export declare function randPoly(minPoints?: number, maxPoints?: number, minRadius?: number, maxRadius?: number): Polygon;
