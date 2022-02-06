import * as PIXI from 'pixi.js';
import { Point, Polygon } from 'pixi.js';

export const getLength = (p: Point) => {
	return Math.sqrt(p.x * p.x + p.y * p.y);
}

/**
 * Returns the distance between two points.
 * @param {*} p1
 * @param {*} p2
 * @returns {number}
 */
export const dist = (p1: Point, p2: Point) => {
	let dx = p2.x - p1.x, dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get the point located by travelling along a sequence of points
 * for the given distance.
 * @param {Point[]} points
 * @param {number} dist
 * @returns {Point}
 */
export const getTravelPt = (points: Point[], dist: number) => {

	let count = points.length;
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
			return new Point(
				curPt.x + d * dx,
				curPt.y + d * dy
			);

		}

		curDist += d;
		prevPt = curPt;

	} //for-loop.

	// point not found.
	return points[count - 1];
}

/**
 * Return interpolated point.
 * @param {Point} p0
 * @param {Point} p1
 * @param {number} t
 */
export const lerpPt = (p0: Point, p1: Point, t: number) => {
	return new Point((1 - t) * p0.x + t * p1.x, (1 - t) * p0.y + p1.y);
}

/**
 * Set p0 to the linear interpolation of p0 and p1.
 * @param {Point} p0
 * @param {Point} p1
 * @param {number} t
 * @returns {Point} returns p0.
 */
export const setLerp = (p0: Point, p1: Point, t: number) => {
	p0.set((1 - t) * p0.x + t * p1.x, (1 - t) * p0.y + p1.y);
}

/**
 * Return a point falling a given distance between two points.
 * @param {Point} p1
 * @param {Point} p2
 * @param {number} len - length between p2 and p1.
 */
export const getMidPt = (p1: Point, p2: Point, len: number) => {

	let dx = p2.x - p1.x;
	let dy = p2.y - p1.y;

	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) return new Point();

	d = len / d;	// convert from distance to percent.

	return new Point(
		p1.x + dx * d,
		p1.y + dy * d
	)

}

/**
 *
 * @param {Point[]} points
 * @returns {Point} Center point of all points.
 */
export const getCenter = (points: Point[]) => {

	let len = points.length;
	if (len === 0) return new Point();

	let p = points[0];
	let x = p.x, y = p.y;

	for (let i = len - 1; i >= 1; i--) {

		p = points[i];
		x += p.x;
		y += p.y;
	}

	x /= len;
	y /= len;

	return new Point(x, y);

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
 * @returns {PIXI.Point} point normal to p.
 */
export const norm = (p: Point) => { return new PIXI.Point(p.y, -p.x) }

/**
 * @returns {number} - magnitude of the cross product p1xp2
 * left hand rule; normals point screen upwards.
 */
export const cross = (p1: Point, p2: Point) => { return p1.x * p2.y - p1.y * p2.x; }

/**
 * move() is separate from translate() because of how PIXI
 * handles Polygon point storage.
 * @property {PIXI.Polygon} poly - polygon to translate.
 */
export const move = (poly: Polygon, tx: number, ty: number) => {

	let points = poly.points;

	for (let i = points.length - 1; i >= 0; i--) {

		points[i] += ty;
		points[--i] += tx;

	}

}

/**
 * @property {Point[]} points
 */
export const translate = (points: Point[], tx: number, ty: number) => {

	for (let i = points.length - 1; i >= 0; i--) {

		var p = points[i];
		p.set(p.x + tx, p.y + ty);

	}

}

/**
 * @property {Point[]} points
 */
export const rotate = (points: Point[], theta: number) => {

	let cos = Math.cos(theta);
	let sin = Math.sin(theta);

	let x, y;
	for (let i = points.length - 1; i >= 0; i--) {

		var p = points[i];

		x = p.x;
		y = p.y;

		p.set(
			x * cos - y * sin,
			x * sin + y * cos
		);

	}

}