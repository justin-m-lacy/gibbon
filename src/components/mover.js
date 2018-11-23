import Component from "../component";
import { Point } from "pixi.js";

export default class Mover extends Component {

	/**
	 * {number} wrappers for gameObject rotation.
	 */
	get rotation() { return this._clip.rotation; }
	set rotation(v) { this._clip.rotation = v; }

	get position() { return this._clip.position; }
	set position(v) { this._clip.position = v;}

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
		this._accel = new Point();

		/**
		 * {Number} Angular velocity in radians per frame.
		 */
		this.omega = 0;

		/**
		 * Maximum rate of rotation.
		 */
		this.omegaMax = Math.PI/20;

		this._accelMax = 4;
		this._velocityMax = 4;

	}

	update(delta) {

		let vel = this._velocity;
		vel.x += this._accel.x*delta;
		vel.y += this._accel.y*delta;

		let vabs = vel.x*vel.x + vel.y*vel.y;
		if ( vabs > this.velocityMax*this.velocityMax ) {
			vabs = Math.sqrt(vabs);
			vel.set( vel.x*this.velocityMax/vabs, vel.y*this.velocityMax/vabs);
		}

		let pos = this.position;
		pos.set( pos.x + vel.x*delta, pos.y +vel.y*delta );


		//this.clip.position = pos;
		this.clip.rotation += this.omega*delta;

	}

}