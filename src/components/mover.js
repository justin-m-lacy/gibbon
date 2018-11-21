import Component from "../component";
import { Point } from "pixi.js";

export default class Mover extends Component {

	/**
	 * {number} wrappers for gameObject rotation.
	 */
	get rotation() { return this.gameObject.rotation; }
	set rotation(v) { this.gameObject.rotation = v; }

	get position() { return this.clip.position; }
	set position(v) { this.clip.position = v;}

	get velocity() { return this._velocity; }
	set velocity(v) { this._velocity.set(v.x, v.y); }

	get accel() { return this._accel;}
	set accel(v) { this._accel =v;}

	init(){

		this._velocity = new Point( 0, 0);
		this.accel = 0;

		/**
		 * {Number} Angular velocity in radians per frame.
		 */
		this.omega = 0;

		/**
		 * Maximum rate of rotation.
		 */
		this.maxOmega = Math.PI/20;

		this.maxAccel = 10;
		this.maxSpeed = 4;
		this.stopAccel = 10;

	}

	update(delta) {

		//console.log( this.pos.x + ',' + this.pos.y );
		//this.vel.addPoint( this.accel );
		if ( this.accel !== 0 ) {
		}

		let pos = this.position;
		pos.set( pos.x + this._velocity.x*delta, pos.y + this._velocity.y*delta );

		//this.clip.position = pos;
		if ( this.omega !== 0 ) this.clip.rotation += this.omega*delta;

	}

}