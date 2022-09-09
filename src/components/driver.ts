import { Component } from '../core/component';

/**
 * A Driver always moves without slipping
 * in the direction of its orientation/angle.
 * Driver is also a good approximation for
 * walking/running characters.
 */
export class Driver extends Component {

    /**
     * @property {number} rotation - wraps actor rotation in radians.
     */
    get rotation() { return this.actor!.rotation; }
    set rotation(v) {
        this.actor!.rotation = v;
    }

    /**
     * @property  position
     */
    get position() { return this.actor!.position; }
    set position(v) { this.actor!.position = v; }

    /**
     * @property  velocity
     */
    get speed() { return this._speed; }
    set speed(v) { this._speed = v; }

    /**
      * @property {number} velocityMax - Maximum absolute value of velocity.
      */
    get speedMax(): number { return this._speedMax; }
    set speedMax(v: number) { this._speedMax = v; }

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

    /**
     * @property accel
     */
    get accel(): number { return this._accel; }
    set accel(v: number) {
        this._accel = v;
    }

    /**
     * @property {number} accelMax
     */
    get accelMax() { return this._accelMax; }
    set accelMax(v: number) { this._accelMax = v; }

    /**
     * Velocity is always along the orientation.
     */
    private _speed: number = 0;

    /**
     * As the driver only moves in the direction of its
     * orientation, acceleration is only a number.
     */
    private _accel: number = 0;

    private _speedMax: number = 4;
    private _accelMax: number = 1;
    private _omegaAcc: number = 0;
    private _omega: number = 0;
    private _omegaMax: number = Math.PI / 40;

    init() {
    }

    update(delta: number) {

        let angle = this.rotation;

        this._omega += this._omegaAcc * delta;
        if (this._omega > this._omegaMax) {
            this._omega = this._omegaMax;
        } else if (this._omega < -this._omegaMax) {
            this._omega = -this._omegaMax;
        }

        angle += this._omega * delta;
        this.rotation = angle;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        this._speed += this._accel * delta;
        if (this._speed > this._speedMax) {
            this._speed = this._speedMax
        } else if (this._speed < -this._speedMax) {
            this._speed = -this._speedMax;
        }

        const pos = this.position;
        pos.set(pos.x + cos * this._speed * delta, pos.y + sin * this._speed * delta);

    }

}