import * as PIXI from 'pixi.js';
import Actor from './core/actor';
import Library from './library';
import { Point, DisplayObject, Container } from 'pixi.js';
export interface IUpdater {
    /**
     *
     * @param delta - time transpired in seconds.
     */
    update(delta: number): void;
}
export default class Engine implements IUpdater {
    /**
     * @property {Container} objectLayer
     */
    objectLayer?: Container;
    /**
     * @property {Actor[]} objects
     */
    readonly objects: Actor[];
    /**
     * @property {IUpdater[]} updaters - Updaters are for systems or objects with update
     * functions that don't require complex Actors.
     */
    readonly updaters: IUpdater[];
    readonly library: Library;
    readonly ticker: PIXI.Ticker;
    constructor(ticker?: PIXI.Ticker);
    /**
     * Instantiate a Actor with a clip or a named clonable object from the library.
     * @param {DisplayObject} [clip=null]
     * @param {PIXI.Point} [loc=null]
     * @returns {Actor}
     */
    Instantiate<T extends DisplayObject>(clip?: T | null | string, loc?: Point | null): Actor<PIXI.DisplayObject>;
    update(): void;
    start(): void;
    stop(): void;
    /**
     * Add Actor to the engine.
     * @param {Actor} obj
    */
    add(obj: Actor): void;
    /**
     *
     * @param {IUpdater} sys
     */
    addUpdater(sys: IUpdater): void;
    /**
     *
     * @param {IUpdater} sys
     */
    removeUpdater(sys: IUpdater): void;
    /**
     * Remove a Actor from the Engine.
     * @param {Actor} obj
     * @returns {boolean} true if object was removed.
     */
    remove(obj: Actor): boolean;
    /**
     * Destroy a game object.
     * @param {Actor} obj
     */
    destroy(obj: Actor): void;
}
