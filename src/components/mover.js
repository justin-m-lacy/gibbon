import Component from "../component";
import { Point } from "pixi.js";

export default class Mover extends Component {

	/**
	 * {number} wrappers for gameObject rotation.
	 */
	get rotation() { return this.clip.rotation; }
	set rotation(v) { this.clip.rotation = v; }

	get position() { return this.clip.position; }
	set position(v) { this.clip.position = v;}

	get velocity() { return this._velocity; }
	set velocity(v) { this._velocity.set(v.x, v.y); }

	get accel() { return this._accel;}
	set accel(v) { this._accel.set(v.x,v.y );}

	/**
	 * {Number} Maximum absolute value of velocity.
	 */
	get velocityMax() { return this._velocityMax; }
	set velocityMax(v) { this._velocityMax = v;}

	/**
	 * {Number}
	 */
	get accelMax() { return this._accelMax; }
	set accelMax(v) { this._accelMax = v; }

	/**
	 * {Number} angular velocity in radians/frame.
	 */
	get omega() { return this._omega;}
	set omega(v) { this._omega=v;}

	get omegaMax() { return this._omegaMax;}
	set omegaMax(v) { this._omegaMax = v;}

	init(){

		this._velocity = new Point();
		this.accel = new Point();

		/**
		 * {Number} Angular velocity in radians per frame.
		 */
		this.omega = 0;

		/**
		 * Maximum rate of rotation.
		 */
		this.omegaMax = Math.PI/20;

		this._accelMax = 10;
		this._velocityMax = 4;

	}

	update(delta) {

		let vel = this._velocity;
		vel.x += this._accel.x*delta;
		vel.y += this._accel.y*delta;

		let pos = this.position;
		pos.set( pos.x + vel.x*delta, pos.y +vel.y*delta );

		//this.clip.position = pos;
		if ( this.omega !== 0 ) this.clip.rotation += this.omega*delta;

	}

}