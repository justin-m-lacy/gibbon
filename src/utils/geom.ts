import { Matrix, Polygon } from 'pixi.js';
import { TPoint } from '../data/geom';

export const PI_2 = 2 * Math.PI;

export const clampTo2Pi = (v: number) => {
	return (v > PI_2 || v < -PI_2) ? v %= PI_2 : v;
}


/**
 * Clamp angle to [-Math.PI, Math.PI]
 */
export const clampToPi = (a: number) => {

	a = a % PI_2;

	if (a > Math.PI) {
		a -= PI_2;
	} else if (a < -Math.PI) {
		a += PI_2;
	}

	return a;
}




export const getLength = (p: TPoint) => {
	return Math.sqrt(p.x * p.x + p.y * p.y);
}

/**
 * Returns the distance between two points.
 */
export const dist = (p1: TPoint, p2: TPoint) => {
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
export const getTravelPt = (points: TPoint[], dist: number) => {

	const count = points.length;
	let curPt, prevPt = points[0];
	let curDist = 0;

	let d;
	for (let i = 1; i < count; i++) {

		curPt = points[i];

		const dx = curPt.x - prevPt.x;
		const dy = curPt.y - prevPt.y;
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
export const lerpPt = (p0: TPoint, p1: TPoint, t: number) => {
	return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
}

/**
 * Set p0 to the linear interpolation of p0 and p1.
 * @param p0
 * @param p1
 * @param {number} t
 * @returns {Point} returns p0.
 */
export const setLerp = (p0: TPoint, p1: TPoint, t: number) => {
	p0.x = (1 - t) * p0.x + t * p1.x;
	p0.y = (1 - t) * p0.y + t * p1.y;
}

/**
 * Return a point falling a given distance between two points.
 * @param p1
 * @param p2
 * @param {number} dist - distance along the path from p1 to p2
 * to get the point of. Actual distance, not a percent.
 */
export const getMidPt = (p1: TPoint, p2: TPoint, dist: number) => {

	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;

	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) return { x: 0, y: 0 };

	d = dist / d;	// convert from distance to percent.

	return {
		x: p1.x + dx * d,
		y: p1.y + dy * d
	};

}

/**
 * Get the center of an array of points.
 * @returns {Point} Center point of all points.
 */
export const getCenter = (points: TPoint[]) => {

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
export const setReflect = (mat: Matrix, a: number, b: number) => {
	mat.set(1 - 2 * b * b, 2 * a * b, 2 * a * b, 1 - 2 * a * a, mat.tx, mat.ty);
}

/**
 * @returns reflection matrix across the normal a,b.
 */
export const reflection = (a: number, b: number) => {
	return new Matrix(1 - 2 * b * b, 2 * a * b, 2 * a * b, 1 - 2 * a * a);
}

/**
 * @returns returns vector orthogonal to p with length equal |p|.
 * Result is not normalized.
 */
export const othogonal = (p: TPoint) => { return { x: p.y, y: -p.x } }

/**
 * @returns {number} - magnitude of the cross product p1xp2
 * left hand rule; normals point screen upwards.
 */
export const cross = (p1: TPoint, p2: TPoint) => { return p1.x * p2.y - p1.y * p2.x; }

/**
 * move() is separate from translate() because of how PIXI
 * handles Polygon point storage.
 * @param poly - polygon to translate.
 */
export const movePoly = (poly: Polygon, tx: number, ty: number) => {

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
export const translate = (points: TPoint[], tx: number, ty: number) => {

	for (let i = points.length - 1; i >= 0; i--) {

		const p = points[i];
		p.x += tx;
		p.y += ty;

	}

}

/**
 * Rotate points about the origin.
 * @param points
 * @param theta - rotation in radians.
 * 
 */
export const rotate = (points: TPoint[], theta: number) => {

	const cos = Math.cos(theta);
	const sin = Math.sin(theta);

	for (let i = points.length - 1; i >= 0; i--) {

		const p = points[i];

		p.x = p.x * cos - p.y * sin;
		p.y = p.x * sin + p.y * cos;

	}

}