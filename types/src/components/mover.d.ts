import Component from "../core/component";
import { Point } from "pixi.js";
import { IPoint } from '../core/game-object';
export default class Mover extends Component {
    /**
     * @property {number} rotation - wraps gameObject rotation in radians.
     */
    get rotation(): number;
    set rotation(v: number);
    /**
     * @property {PIXI.Point} position
     */
    get position(): Point;
    set position(v: Point);
    /**
     * @property {PIXI.Point} velocity
     */
    get velocity(): Point;
    set velocity(v: Point);
    /**
      * @property {number} velocityMax - Maximum absolute value of velocity.
      */
    get velocityMax(): number;
    set velocityMax(v: number);
    /**
     * @property {PIXI.Point} accel
     */
    get accel(): IPoint;
    set accel(v: IPoint);
    /**
     * @property {number} accelMax
     */
    get accelMax(): number;
    set accelMax(v: number);
    /**
     * @property {number} omegaAcc
     */
    get omegaAcc(): number;
    set omegaAcc(v: number);
    /**
     * @property {number} omega - angular velocity in radians/frame.
     */
    get omega(): number;
    set omega(v: number);
    /**
     * @property {number} omegaMax
     */
    get omegaMax(): number;
    set omegaMax(v: number);
    readonly _velocity: Point;
    readonly _accel: Point;
    private _speedMax;
    private _accelMax;
    private _omegaAcc;
    private _omega;
    private _omegaMax;
    constructor();
    init(): void;
    /**
     * Set mover velocity.
     * @param {number} vx
     * @param {number} vy
     */
    set(vx: number, vy: number): void;
    update(delta: number): void;
}
