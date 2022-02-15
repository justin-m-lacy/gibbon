import Component from "../src/component";
import { Point } from "pixi.js";

export default class Mover extends Component {

	/**
	 * @property {number} rotation - wraps gameObject rotation in radians.
	 */
	get rotation() { return this.clip!.rotation; }
	set rotation(v) {
		if (v > Math.PI) v -= 2 * Math.PI;
		else if (v < -Math.PI) v += 2 * Math.PI;
		this.clip!.rotation = v;
	}

	/**
	 * @property {PIXI.Point} position
	 */
	get position() { return this.clip!.position; }
	set position(v) { this.clip!.position = v; }

	/**
	 * @property {PIXI.Point} velocity
	 */
	get velocity() { return this._velocity; }
	set velocity(v) { this._velocity.set(v.x, v.y); }

	/**
	 * @property {PIXI.Point} accel
	 */
	get accel() { return this._accel; }
	set accel(v) { this._accel.set(v.x, v.y); }

	/**
	 * @property {number} velocityMax - Maximum absolute value of velocity.
	 */
	get speedMax(): number { return this._speedMax; }
	set speedMax(v: number) { this._speedMax = v; }

	/**
	 * @property {number} accelMax
	 */
	get accelMax() { return this._accelMax; }
	set accelMax(v: number) { this._accelMax = v; }

	/**
	 * @property {number} omegaAcc
	 */
	get omegaAcc() { return this._omegaAcc; }
	set omegaAcc(v) { this._omegaAcc = v; }

	/**
	 * @property {number} omega - angular velocity in radians/frame.
	 */
	get omega() { return this._omega; }
	set omega(v) { this._omega = v; }

	/**
	 * @property {number} omegaMax
	 */
	get omegaMax() { return this._omegaMax; }
	set omegaMax(v) { this._omegaMax = v; }

	readonly _velocity: Point = new Point();
	readonly _accel: Point = new Point();

	_speedMax: number = 4;
	_accelMax: number = 1;
	_omegaAcc: number = 0;
	_omega: number = 0;
	_omegaMax: number = Math.PI / 40;

	constructor() {
		super();
	}

	init() {
	}

	/**
	 * Set mover velocity.
	 * @param {number} vx
	 * @param {number} vy
	 */
	set(vx: number, vy: number) {
		this.velocity.set(vx, vy);
	}

	update(delta: number) {

		if (this._omegaAcc !== 0) this._omega += this._omegaAcc * delta;
		if (this._omega > this._omegaMax) this._omega = this._omegaMax;
		else if (this._omega < -this._omegaMax) this._omega = -this._omegaMax;

		this.rotation += this._omega * delta;


		const vel = this._velocity;
		vel.x += this._accel.x * delta;
		vel.y += this._accel.y * delta;

		let vabs = vel.x * vel.x + vel.y * vel.y;
		if (vabs > this._speedMax * this._speedMax) {
			vabs = this._speedMax / Math.sqrt(vabs);
			vel.set(vabs * vel.x, vabs * vel.y);
		}

		const pos = this.position;
		pos.set(pos.x + vel.x * delta, pos.y + vel.y * delta);

	}

}