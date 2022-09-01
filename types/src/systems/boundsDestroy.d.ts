import System from "../system";
import { Rectangle, Container } from "pixi.js";
import Actor from '../core/actor';
export declare type ExitFunction = (go: Actor) => void;
/**
 *
 */
export default class BoundsDestroy extends System {
    /**
     * @property {(Actor)=>void} onExit - function to call when object
     * leaves bounds. If a function is specified, the object is not destroyed
     * automatically, but is removed from group.
     */
    onExit?: ExitFunction;
    /**
     * @property {Rectangle} bounds - objects in system outside the bounds
     * will automatically be destroyed unless an onExit() function is specified.
     * If so, the onExit function will be called instead.
     */
    readonly bounds: Rectangle;
    /**
     *
     * @param {Game} game
     * @param {Container} clip
     * @param {Rectangle} rect
     */
    constructor(rect: Rectangle, clip?: Container);
    update(): void;
}
