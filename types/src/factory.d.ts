import Game from './game';
import GameObject from './game-object';
import * as PIXI from 'pixi.js';
export declare type CreateFunction = (...params: any[]) => GameObject;
/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {
    /**
     * @property {PIXI.renderer} renderer - game renderer to pre-render objects to textures.
     */
    get renderer(): PIXI.Renderer | PIXI.AbstractRenderer;
    /**
     * @property {Gibbon.Game} game
     */
    get game(): Game;
    /**
     * @property {Gibbon.Engine} engine
     */
    get engine(): import("./engine").default;
    /**
     * @property {PIXI.Rectangle} viewRect
     */
    get viewRect(): PIXI.Rectangle;
    readonly builds: Map<string, CreateFunction>;
    readonly _game: Game;
    /**
     *
     * @param {Gibbon.Game} game
     */
    constructor(game: Game);
    /**
     * Associates a key with the given creator function, binding it to this factory
     * instance.
     * @param {string} key
     * @param {Function} func
     * @param {?object} data - data to pass as first argument to create function.
     * @returns {Factory} this.
     */
    addCreator(key: string, creator: CreateFunction, data?: any): this;
    /**
     * Create a GameObject from the given key.
     * @param {string} key
     * @returns {GameObject} Object created.
     */
    create(key: string, ...args: any[]): GameObject | null;
}
