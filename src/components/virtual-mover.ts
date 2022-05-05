import Component from "../component";
import { Point } from "pixi.js";
import { IPoint } from '../game-object';

/**
 * VirtualMover tracks velocity, acceleration, and rotation
 * while leaving the actual position placement to another component.
 */
export default class VirtualMover extends Component {

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
     * @property {PIXI.Point} velocity
     */
    get velocity(): IPoint { return this._velocity; }
    set velocity(v: IPoint) { this._velocity.set(v.x, v.y); }

    /**
     * @property {PIXI.Point} accel
     */
    get accel(): IPoint { return this._accel; }
    set accel(v: IPoint) {

        if (v.x === 0 && v.y === 0) {
            this._accel.set(0, 0);
        } else if (this._accelMax > 0) {

            const d = this._accelMax / Math.sqrt(v.x * v.x + v.y * v.y);
            this._accel.set(d * v.x, d * v.y);

        } else {
            this._accel.set(v.x, v.y);
        }
    }

    /**
     * @property {number} velocityMax - Maximum absolute value of velocity.
     */
    get velocityMax(): number { return this._speedMax; }
    set velocityMax(v: number) { this._speedMax = v; }

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

    private _speedMax: number = 4;
    private _accelMax: number = 1;
    private _omegaAcc: number = 0;
    private _omega: number = 0;
    private _omegaMax: number = Math.PI / 40;

    private _rotation: number = 0;
    private readonly _position: Point = new Point();

    init() {

        this._position.copyFrom(this.gameObject!.position);
        this._rotation = this.gameObject!.rotation;

    }

    /**
     * Set mover velocity.
     * @param {number} vx
     * @param {number} vy
     */
    set(vx: number, vy: number) {
        this._velocity.set(vx, vy);
    }

    update(delta: number) {

        if (this._omegaAcc !== 0) this._omega += this._omegaAcc * delta;
        if (this._omega > this._omegaMax) this._omega = this._omegaMax;
        else if (this._omega < -this._omegaMax) this._omega = -this._omegaMax;

        this._rotation += this._omega * delta;

        const vel = this._velocity;
        vel.x += this._accel.x * delta;
        vel.y += this._accel.y * delta;

        let abs = vel.x * vel.x + vel.y * vel.y;
        if (abs > this._speedMax * this._speedMax) {
            abs = this._speedMax / Math.sqrt(abs);
            vel.set(abs * vel.x, abs * vel.y);
        }

        this._position.x = this._position.x + vel.x * delta;
        this._position.y = this._position.y + vel.y * delta;


    }

}