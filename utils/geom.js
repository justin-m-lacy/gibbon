import * as PIXI from 'pixi.js';

export const getLength=(p)=> {
		return Math.sqrt(p.x*p.x +p.y*p.y);
}

	/**
	 * Returns the distance between two points.
	 * @param {*} p1
	 * @param {*} p2
	 * @returns {number}
	 */
	export const dist=( p1, p2) => {
		let dx = p2.x - p1.x, dy = p2.y - p1.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	/**
	 * Get the point located by travelling along a sequence of points
	 * for the given distance.
	 * @param {Point[]} points
	 * @param {number} dist
	 * @returns {Point}
	 */
	export const getTravelPt=( points, dist ) => {

		let count = points.length;
		let curPt, prevPt = points[0];
		let curDist = 0;

		let dx,dy,d;
		for( let i = 1; i < count; i++ ) {

			curPt = points[i];

			dx = curPt.x - prevPt.x;
			dy = curPt.y - prevPt.y;
			d = Math.sqrt(dx*dx +dy*dy);

			if ( (curDist + d) >= dist ) {

				// distance pt comes before curPt.

				d = (dist - curDist ) / d;	// percent between points.
				return new Point(
					p1.x + d*dx,
					p1.y + d*dy
				);

			}

			curDist += d;
			prevPt = curPt;

		} //for-loop.

		// point not found.
		return points[count-1];
	}

	/**
	 * Return an interpolated point.
	 * @param {Point} p0
	 * @param {Point} p1
	 * @param {number} t
	 */
	export const interPt=(p0, p1, t)=>{
		return new Point( (1-t)*p0.x + t*p1.x, (1-t)*p0.y+p1.y );
	}

	/**
	 * Return a point falling a given distance between two points.
	 * @param {Point} p1
	 * @param {Point} p2
	 * @param {number} len - length between p2 and p1.
	 */
	export const getMidPt=( p1, p2, len ) => {

		let dx = p2.x - p1.x;
		let dy = p2.y - p1.y;

		let d = Math.sqrt(dx*dx + dy*dy);
		if ( d === 0 ) return new Point();

		d = len / d;	// convert from distance to percent.

		return new Point(
			p1.x + dx*d,
			p1.y + dy*d
		)

	}

	/**
	 *
	 * @param {Point[]} points
	 * @returns {Point} Center point of all points.
	 */
	export const getCenter=(points) => {

		if ( points.type === PIXI.SHAPES.POLY ) points = points.points;

		let len = points.length;
		if ( len === 0 ) return new Point();

		let p = points[0];
		let x = p.x, y = p.y;

		for( let i =len-1; i>=1; i-- ) {

			p = points[i];
			x+=p.x;
			y+=p.y;
		}

		x /= len;
		y /= len;

		return new Point(x,y);

	}

	/**
	 * sets the values of mat to a reflection across normal axis a,b
	 * without altering tx,ty.
	 * @returns {Matrix}
	 */
	export const setReflect=(mat,a,b)=>{
		mat.set(  1-2*b*b, 2*a*b, 2*a*b, 1-2*a*a, mat.tx, mat.ty);
	}

	/**
	 * @returns {PIXI.Matrix} - reflection matrix across the normal a,b.
	 */
	export const reflection=(a,b)=>{
		return new PIXI.Matrix( 1-2*b*b, 2*a*b, 2*a*b, 1-2*a*a );
	}

	/**
	 * @returns {PIXI.Point} point normal to p.
	 */
	export const norm=(p)=>{ return new Point(p.y, -p.x)}

	/**
	 * @returns {number} - magnitude of the cross product p1xp2
	 * left hand rule; normals point screen upwards.
	 */
	export const cross=(p1, p2)=>{ return p1.x*p2.y - p1.y*p2.x; }

	/**
	 * move() is separate from translate() because of how PIXI
	 * handles Polygon point storage.
	 * @property {PIXI.Polygon} poly - polygon to translate.
	 */
	export const move=(poly,tx,ty)=>{

		let points = poly.points;

		for( let i = points.length-1; i>=0; i-- ) {

			points[i] += ty;
			points[--i] += tx;

		}

	}

	/**
	 * @property {Point[]} points
	 */
	export const translate=(points, tx, ty )=>{

		for( let i = points.length-1; i>=0; i-- ) {

			var p = points[i];
			p.set( p.x + tx, p.y + ty );

		}

	}

	/**
	 * @property {Point[]} points
	 */
	export const rotate=(points, theta )=>{

		let cos = Math.cos(theta);
		let sin = Math.sin(theta);

		let x, y;
		for( let i = points.length-1; i>=0; i-- ) {

			var p = points[i];

			x = p.x;
			y = p.y;

			p.set(
				x*cos - y*sin,
				x*sin + y*cos
			);

		}

	}