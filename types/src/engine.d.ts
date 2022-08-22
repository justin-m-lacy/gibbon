import * as PIXI from 'pixi.js';
import GameObject from './core/game-object';
import Library from './library';
import { Point, DisplayObject, Container } from 'pixi.js';
export interface IUpdater {
    update(delta: number): void;
}
export default class Engine implements IUpdater {
    /**
     * @property {Container} objectLayer
     */
    objectLayer?: Container;
    /**
     * @property {GameObject[]} objects
     */
    readonly objects: GameObject[];
    /**
     * @property {IUpdater[]} updaters - Updaters are for systems or objects with update
     * functions that don't require complex GameObjects.
     */
    readonly updaters: IUpdater[];
    readonly library: Library;
    readonly ticker: PIXI.Ticker;
    constructor(ticker?: PIXI.Ticker);
    /**
     * Instantiate a GameObject with a clip or a named clonable object from the library.
     * @param {DisplayObject} [clip=null]
     * @param {PIXI.Point} [loc=null]
     * @returns {GameObject}
     */
    Instantiate(clip?: DisplayObject | null | string, loc?: Point | null): GameObject;
    update(): void;
    start(): void;
    stop(): void;
    /**
     * Add GameObject to the engine.
     * @param {GameObject} obj
    */
    add(obj: GameObject): void;
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
     * Remove a GameObject from the Engine.
     * @param {GameObject} obj
     * @returns {boolean} true if object was removed.
     */
    remove(obj: GameObject): boolean;
    /**
     * Destroy a game object.
     * @param {GameObject} obj
     */
    destroy(obj: GameObject): void;
}
