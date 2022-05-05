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
    get rotation(): number;
    set rotation(v: number);
    /**
     * @property {PIXI.Point} velocity
     */
    get velocity(): IPoint;
    set velocity(v: IPoint);
    /**
     * @property {PIXI.Point} accel
     */
    get accel(): IPoint;
    set accel(v: IPoint);
    /**
     * @property {number} velocityMax - Maximum absolute value of velocity.
     */
    get velocityMax(): number;
    set velocityMax(v: number);
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
    private _rotation;
    private readonly _position;
    init(): void;
    /**
     * Set mover velocity.
     * @param {number} vx
     * @param {number} vy
     */
    set(vx: number, vy: number): void;
    update(delta: number): void;
}
