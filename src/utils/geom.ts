import * as PIXI from 'pixi.js';
import { Point, Polygon } from 'pixi.js';
import { IPoint } from '../core/actor';

export const getLength = (p: IPoint): number => {
	return Math.sqrt(p.x * p.x + p.y * p.y);
}

/**
 * Returns the distance between two points.
 */
export const dist = (p1: IPoint, p2: IPoint): number => {
	const dx = p2.x - p1.x, dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get a point located by travelling along a sequence of points
 * for the given distance.
 * @param  points
 * @param  dist
 * @returns {Point}
 */
export const getTravelPt = (points: IPoint[], dist: number) => {

	const count = points.length;
	let curPt, prevPt = points[0];
	let curDist = 0;

	let dx, dy, d;
	for (let i = 1; i < count; i++) {

		curPt = points[i];

		dx = curPt.x - prevPt.x;
		dy = curPt.y - prevPt.y;
		d = Math.sqrt(dx * dx + dy * dy);

		if ((curDist + d) >= dist) {

			// distance pt comes before curPt.

			d = (dist - curDist) / d;	// percent between points.
			// TODO: check if curPt is right here.
			return {
				x: curPt.x + d * dx,
				y: curPt.y + d * dy
			};

		}

		curDist += d;
		prevPt = curPt;

	} //for-loop.

	// point not found.
	return { x: prevPt.x, y: prevPt.y };
}

/**
 * Return interpolated point.
 * @param p0
 * @param p1
 * @param {number} t
 */
export const lerpPt = (p0: IPoint, p1: IPoint, t: number) => {
	return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + p1.y };
}

/**
 * Set p0 to the linear interpolation of p0 and p1.
 * @param p0
 * @param p1
 * @param {number} t
 * @returns {Point} returns p0.
 */
export const setLerp = (p0: IPoint, p1: IPoint, t: number) => {
	p0.x = (1 - t) * p0.x + t * p1.x;
	p0.y = (1 - t) * p0.y + p1.y;
}

/**
 * Return a point falling a given distance between two points.
 * @param p1
 * @param p2
 * @param {number} len - length between p2 and p1.
 */
export const getMidPt = (p1: IPoint, p2: IPoint, len: number) => {

	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;

	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) return { x: 0, y: 0 };

	d = len / d;	// convert from distance to percent.

	return {
		x: p1.x + dx * d,
		y: p1.y + dy * d
	};

}

/**
 *
 * @param points
 * @returns {Point} Center point of all points.
 */
export const getCenter = (points: IPoint[]) => {

	const len = points.length;
	if (len === 0) return { x: 0, y: 0 };

	let p = points[0];
	let x = p.x, y = p.y;

	for (let i = len - 1; i >= 1; i--) {

		p = points[i];
		x += p.x;
		y += p.y;
	}

	return { x: x / len, y: y / len };

}

/**
 * sets the values of mat to a reflection across normal axis a,b
 * without altering tx,ty.
 * @returns {Matrix}
 */
export const setReflect = (mat: PIXI.Matrix, a: number, b: number) => {
	mat.set(1 - 2 * b * b, 2 * a * b, 2 * a * b, 1 - 2 * a * a, mat.tx, mat.ty);
}

/**
 * @returns {PIXI.Matrix} - reflection matrix across the normal a,b.
 */
export const reflection = (a: number, b: number) => {
	return new PIXI.Matrix(1 - 2 * b * b, 2 * a * b, 2 * a * b, 1 - 2 * a * a);
}

/**
 * @returns point normal to p.
 */
export const norm = (p: IPoint) => { return { x: p.y, y: -p.x } }

/**
 * @returns {number} - magnitude of the cross product p1xp2
 * left hand rule; normals point screen upwards.
 */
export const cross = (p1: IPoint, p2: IPoint) => { return p1.x * p2.y - p1.y * p2.x; }

/**
 * move() is separate from translate() because of how PIXI
 * handles Polygon point storage.
 * @param poly - polygon to translate.
 */
export const move = (poly: Polygon, tx: number, ty: number) => {

	const points = poly.points;

	for (let i = points.length - 1; i >= 0; i--) {

		points[i] += ty;
		points[--i] += tx;

	}

}

/**
 * Translate an array of points by (tx,ty)
 * @property points
 */
export const translate = (points: IPoint[], tx: number, ty: number) => {

	for (let i = points.length - 1; i >= 0; i--) {

		const p = points[i];
		p.x += tx;
		p.y += ty;

	}

}

/**
 * @param points
 * @param theta - rotation in radians.
 * 
 */
export const rotate = (points: IPoint[], theta: number) => {

	const cos = Math.cos(theta);
	const sin = Math.sin(theta);

	for (let i = points.length - 1; i >= 0; i--) {

		const p = points[i];

		p.x = p.x * cos - p.y * sin;
		p.y = p.x * sin + p.y * cos;

	}

}