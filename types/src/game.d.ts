import * as PIXI from 'pixi.js';
import { Rectangle, DisplayObject, Container, InteractionEvent } from 'pixi.js';
import LayerManager from './layerManager';
import Engine from './engine';
import GameObject from './game-object';
import Camera from './components/camera';
import Group from './group';
import Library from './library';
import Factory from './factory';
import { LayerData } from './layerManager';
import { Tween } from '@tweenjs/tween.js';
/**
 * Extendable Game class.
 */
export default class Game {
    /**
     * @property {PIXI.Application} app
     */
    get app(): PIXI.Application;
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
     * @property {GameObject} root - GameObject containing the main Camera component
     * and base objectLayer.
     * Basic game systems can also be added to root as Components.
     */
    get root(): GameObject;
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
    /**
     * @property {Factory} factory - Factory used for Object creation.
     */
    get factory(): Factory | null;
    set factory(v: Factory | null);
    /**
     * @property {number} wheelScale - Amount by which to scroll wheel input.
     */
    wheelScale: number;
    wheelEnabled: boolean;
    /**
     * Stored value of wheel scrolling function when wheel is enabled.
     */
    wheelFunc?: (e: WheelEvent) => void;
    /**
     * @property {Group[]} groups
     */
    get groups(): Group[];
    /**
     * @property {Engine} engine
     */
    get engine(): Engine;
    /**
     * @property {LayerManager} layerManager
     */
    get layerManager(): LayerManager;
    _app: PIXI.Application;
    _screen: Rectangle;
    _stage: Container;
    _wheelScale: number;
    _loader: PIXI.Loader;
    _groups: Group[];
    _ticker: PIXI.Ticker;
    _sharedTicker: PIXI.Ticker;
    _emitter: PIXI.utils.EventEmitter;
    _factory: Factory | null;
    _engine: Engine;
    library: Library;
    _layerManager?: LayerManager;
    _camera?: Camera;
    _root?: GameObject;
    /**
     *
     * @param {PIXI.Application} app - The pixi application, or options object.
     */
    constructor(app: PIXI.Application);
    /**
     * After init(), layerManager and game layers are available for use.
     */
    init(layerData?: LayerData[]): void;
    /**
     * Start the game object ticker and engine ticker.
     */
    start(): void;
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
    on(event: string, func: PIXI.utils.EventEmitter.ListenerFn, context?: null): PIXI.utils.EventEmitter<string | symbol>;
    /**
     * Emit event with game emitter.
     * @param  {...any} args
     */
    emit(...args: any): void;
    off(evt: string, fn?: (evt: InteractionEvent) => void, context?: any): PIXI.utils.EventEmitter<string | symbol>;
    findGroup(name: string): Group | undefined;
    addGroup(g: Group): void;
    /**
     *
     * @param {Group} g
     * @returns {boolean} True if g was found and removed.
     */
    removeGroup(g: Group): boolean;
    /**
     * Wrapper for Engine.add(gameObject)
     * @param {GameObject} gameObject
     */
    addObject(gameObject: GameObject): void;
    /**
     *
     * @param {*} sys
     */
    addUpdater(sys: any): void;
    /**
     *
     * @param {*} sys
     */
    removeUpdater(sys: any): void;
    /**
     *
     * @param {function} func
     * @param {*} context
     * @returns {PIXI.Ticker}
     */
    addUpdate(func: (...params: any[]) => any, context?: any): void;
    /**
     *
     * @param {function} func
     * @param {*} context
     * @returns {PIXI.Ticker}
     */
    removeUpdate(func: (...params: any[]) => any, context?: any): PIXI.Ticker;
    pause(): void;
    unpause(): void;
    /**
     * Wraps engine.Instantiate()
     * Instantiate a GameObject with a clip or a named clonable object from the library.
     * @param {DisplayObject} [clip=null]
     * @param {PIXI.Point} [loc=null]
     * @returns {GameObject}
     */
    instantiate(clip?: null, loc?: null): GameObject;
    /**
     * Creates an empty game object with a Container clip.
     * @param {Point|Object} [loc=null]
     * @return {GameObject}
     */
    makeEmpty(loc?: null): GameObject;
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
