import * as PIXI from 'pixi.js';

export default {

	getLength:(p)=> {
		return Math.sqrt(p.x*p.x +p.y*p.y);
	},

	/**
	 * Returns the distance between two points.
	 * @param {*} p1
	 * @param {*} p2
	 * @returns {number}
	 */
	dist:( p1, p2) => {
		let dx = p2.x - p1.x, dy = p2.y - p1.y;
		return Math.sqrt(dx*dx + dy*dy);
	},

	/**
	 * Get the point located by travelling along a sequence of points
	 * for the given distance.
	 * @param {Point[]} points
	 * @param {number} dist
	 * @returns {Point}
	 */
	getTravelPt:( points, dist ) => {

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
	},

	/**
	 * Return a point falling a given distance between two points.
	 * @param {Point} p1
	 * @param {Point} p2
	 * @param {number} len - length between p2 and p1.
	 */
	getMidPt:( p1, p2, len ) => {

		let dx = p2.x - p1.x;
		let dy = p2.y - p1.y;

		let d = Math.sqrt(dx*dx + dy*dy);
		if ( d === 0 ) return new Point();

		d = len / d;	// convert from distance to percent.

		return new Point(
			p1.x + dx*d,
			p1.y + dy*d
		)

	},

	/**
	 *
	 * @param {Point[]} points
	 * @returns {Point} Center point of all points.
	 */
	getCenter:(points) => {

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

	},

	/**
	 * move() is separate from translate() because of how PIXI
	 * handles Polygon point storage.
	 * @property {PIXI.Polygon} poly - polygon to translate.
	 */
	move:(poly,tx,ty)=>{

		let points = poly.points;

		for( let i = points.length-1; i>=0; i-- ) {

			points[i] += ty;
			points[--i] += tx;

		}

	},

	/**
	 * @property {Point[]} points
	 */
	translate:(points, tx, ty )=>{

		for( let i = points.length-1; i>=0; i-- ) {

			var p = points[i];
			p.set( p.x + tx, p.y + ty );

		}

	},

	/**
	 * @property {Point[]} points
	 */
	rotate:(points, theta )=>{

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

}