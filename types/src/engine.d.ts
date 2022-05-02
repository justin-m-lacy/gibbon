import GameObject from './game-object';
import Library from './library';
import Factory from './factory';
import { Point, DisplayObject, Container } from 'pixi.js';
import System from './system';
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
    factory: Factory | null;
    constructor();
    /**
     *
     * @param {string} key
     * @param {Point} [loc=null]
     * @param {Object} [vars=null] variables to use in creating the new object.
     * @returns {GameObject}
     */
    Create(key: string, loc?: Point | null, vars?: Object | null): GameObject | null;
    /**
     * Instantiate a GameObject with a clip or a named clonable object from the library.
     * @param {DisplayObject} [clip=null]
     * @param {PIXI.Point} [loc=null]
     * @returns {GameObject}
     */
    Instantiate(clip?: DisplayObject | null | string, loc?: Point | null): GameObject;
    start(): void;
    stop(): void;
    /**
     * Add GameObject to the engine.
     * @param {GameObject} obj
    */
    add(obj: GameObject): void;
    /**
     *
     * @param {System|Object} sys
     */
    addUpdater(sys: System | IUpdater): void;
    /**
     *
     * @param {System|IUpdater} sys
     */
    removeUpdater(sys: IUpdater): void;
    update(delta: number): void;
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
