import * as PIXI from 'pixi.js';
import { Rectangle, DisplayObject, Container, Point, Application } from 'pixi.js';
import LayerManager from './layerManager';
import Engine from './engine';
import Actor from './core/actor';
import Camera from './components/camera';
import Group from './core/group';
import Library from './library';
import { LayerData } from './layerManager';
import { Tween } from '@tweenjs/tween.js';
import { IUpdater } from './engine';
/**
 * Extendable Game class.
 */
export default class Game {
    static current: Game;
    /**
     * @property {Application} app
     */
    get app(): Application;
    /**
     * @property {PIXI.Renderer} renderer - renderer for application.
     * Convenience accessor. Cache for quick access.
     */
    get renderer(): PIXI.Renderer | PIXI.AbstractRenderer;
    /**
     * @property {PIXI.Container} stage
     */
    get stage(): PIXI.Container;
    /**
     * @property {PIXI.Loader} loader
     */
    get loader(): PIXI.Loader;
    set loader(v: PIXI.Loader);
    /**
     * @property {PIXI.Rectangle} screen - Screen/View Rectangle.
     */
    get screen(): Rectangle;
    get camera(): Camera | undefined;
    /**
     * @property {Actor} root - Actor containing the main Camera component
     * and base objectLayer.
     * Basic game systems can also be added to root as Components.
     */
    get root(): Actor;
    get defaultGroup(): Group;
    get objectLayer(): Container;
    get uiLayer(): Container;
    /**
     * @property {PIXI.Container} backgroundLayer
     */
    get backgroundLayer(): DisplayObject | undefined;
    /**
     * @property {PIXI.Ticker} ticker - Game Ticker.
     */
    get ticker(): PIXI.Ticker;
    /**
     * @property {PIXI.Ticker} sharedTicker - Shared non-game ticker. (UI Elements, nonpausing effects.)
    */
    get sharedTicker(): PIXI.Ticker;
    /**
     * @property {PIXI.utils.EventEmitter} emitter - Game-level Emitter. By default, the PIXI shared EventEmitter.
     */
    get emitter(): PIXI.utils.EventEmitter<string | symbol>;
    /**
     * @property {InteractionData} mouseInfo - convenience accessor for global mouse information.
     */
    get mouseInfo(): any;
    get groups(): Group<Game>[];
    /**
     * @property {Engine} engine
     */
    get engine(): Engine;
    /**
     * @property {LayerManager} layerManager
     */
    get layerManager(): LayerManager;
    private _app;
    private _screen;
    private _stage;
    private _loader;
    private _groups;
    /**
     * Default group for added objects.
     */
    private _defaultGroup;
    private _emitter;
    private _engine;
    library: Library;
    private _layerManager?;
    private _camera?;
    /**
     *
     * @param app - The pixi application, or options object.
     */
    constructor(app: Application);
    /**
     * After init(), layerManager and game layers are available for use.
     */
    init(layerData?: LayerData[]): void;
    /**
     * Start the game object ticker and engine ticker.
     */
    start(): void;
    pause(): void;
    unpause(): void;
    /**
     * Size the game to the full browser window.
     * @returns {function} The resize event listener, so it can be removed later.
     */
    fullscreen(): () => void;
    /**
     * Wrapper for default game event emitter.
     * @param {string} event
     * @param {Function} func
     * @param {*} [context=null]
     * @returns {PIXI.utils.EventEmitter}
     */
    on(event: string, func: PIXI.utils.EventEmitter.ListenerFn, context?: any): PIXI.utils.EventEmitter<string | symbol>;
    /**
     * Emit event with game emitter.
     * @param  {...any} args
     */
    emit(...args: any): void;
    off(evt: string, fn?: PIXI.utils.EventEmitter.ListenerFn, context?: any): PIXI.utils.EventEmitter<string | symbol>;
    findGroup(name: string): Group | undefined;
    /**
     * Add group to game. Attempting to add the same group multiple
     * times to a game will be ignored.
     * @param g
     */
    addGroup(g: Group): void;
    /**
     * Remove group from game.
     * @param {Group} g
     * @returns {boolean} True if g was found and removed.
     */
    removeGroup(g: Group): boolean;
    /**
     * Wrapper for Engine.add(actor)
     * @param {Actor} actor
     */
    addObject(actor: Actor): void;
    /**
     *
     * @param {*} sys
     */
    addUpdater(sys: IUpdater): void;
    /**
     *
     * @param {*} sys
     */
    removeUpdater(sys: IUpdater): void;
    /**
     * Wraps engine.Instantiate()
     * Instantiate a Actor with a clip or a named clonable object from the library.
     */
    instantiate(clip?: DisplayObject, loc?: PIXI.Point): Actor<PIXI.DisplayObject>;
    /**
     * Create an empty game object with a Container clip.
     */
    makeContainer(loc?: Point): Actor<PIXI.DisplayObject>;
    /**
     * Create empty game object with no clip.
     */
    makeEmpty(loc?: PIXI.Point): Actor<PIXI.DisplayObject>;
    /**
     * Replace existing tweens on the target with a newly created one.
     * Convenience accesor for setting config data.
     * @param {*} target
     * @param {object} config
     * @param {?number} time
     * @returns {Tween} - The tween created.
     */
    replaceTween<T>(target: T, props: any, time?: number): Tween<T>;
    /**
     * Convenience function for creating new tween.
     * @param {*} target - target of the Tween.
     * @param {Object} config - configuration object for gsap tween.
     * @param {?number} time - tween time.
     * @returns {Tween}
     */
    createTween<T>(target: T, props: any, time?: number): Tween<T>;
    /**
     * Enable mouse wheel events.
     */
    enableWheel(): void;
    /**
     * Disable wheel events.
     */
    disableWheel(): void;
}
