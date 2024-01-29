import { Point, Polygon } from "pixi.js";
import type { Rectangle } from 'pixi.js';

/**
 * Return random point in Rectangle.
 * @param {Rectangle} r
 * @returns {Point}
 */
export const randInRect = (r: Rectangle) => {
	return new Point(r.x + Math.random() * r.width, r.y + Math.random() * r.height)
}

/**
* @returns {number} random integer in min,max inclusive
*/
export const randInt = (min: number, max: number) => { return min + Math.floor(Math.random() * (max + 1 - min)) }

/** 
 * @returns Random float f, min <= f < max
 */
export const randFloat = (min: number, max: number) => { return min + (Math.random() * (max - min)) }

/**
* Create random polygon centered on 0,0.
* @param {number} minPoints
* @param {number} maxPoints
* @param {number} minRadius
* @param {number} maxRadius
*/
export function randPoly(minPoints = 3, maxPoints = 4, minRadius = 4, maxRadius = 10) {

	const len = randInt(minPoints, maxPoints);
	const step = 2 * Math.PI / maxPoints;

	const pts = new Array(len);
	let theta = 0;
	for (let i = 0; i < len; i++) {

		const r = minRadius + Math.random() * (maxRadius - minRadius);
		pts[i] = new Point(r * Math.cos(theta), r * Math.sin(theta));

		theta += step;

	}

	return new Polygon(pts);

}