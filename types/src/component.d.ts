import GameObject from "./game-object";
import { Constructor } from './utils/types';
import { DisplayObject } from 'pixi.js';
import Game from './game';
export default class Component {
    /**
     * @property {Game} game
     */
    get game(): Game;
    /**
     * @property {Engine} engine
     */
    get engine(): import("./engine").default;
    /**
     * @property {number} flags - Convenience accessor for GameObject.flags.
     */
    get flags(): number;
    set flags(v: number);
    /**
     * Group controlling the component's GameObject, if any.
     */
    get group(): import("./group").default | null | undefined;
    /**
     * @property {boolean} enabled - Whether the component is enabled.
     */
    get enabled(): boolean;
    set enabled(v: boolean);
    /**
     * @property {number} x
     */
    get x(): number;
    set x(v: number);
    /**
     * @property {number} y
    */
    get y(): number;
    set y(v: number);
    /**
    * @property {number} rotation - underlying clip rotation in radians.
    */
    get rotation(): number;
    set rotation(v: number);
    /**
     * @property {PIXI.Point} position - only usable after init()
     */
    get position(): import("pixi.js").Point;
    set position(v: import("pixi.js").Point);
    /**
     * Indicates the component has been marked for disposal and should no longer
     * be referenced.
     * @property {Boolean} isDestroyed
     */
    get isDestroyed(): boolean;
    get sleep(): boolean;
    set sleep(v: boolean);
    /**
     * @property {GameObject} - Game object containing this component.
     */
    gameObject?: GameObject;
    _enabled: boolean;
    _destroyed: boolean;
    /**
     * True if component should sleep.
     */
    _sleep: boolean;
    /**
     * @property {DisplayObject} clip - Convenience copy of GameObject clip.
     */
    clip?: DisplayObject | null;
    /**
     * Constructor intentionally empty so components can be
     * instantiated and added to GameObjects without
     * knowledge of the underlying game system.
     * @note component properties such as gameObject, clip, and game,
     * are not available in component constructor.
     */
    constructor();
    /**
     * Private initializer calls subclassed init()
     * @param {GameObject} gameObject
     */
    _init(gameObject: GameObject): void;
    /**
     * Called when gameObject.active is set to true.
     */
    onActivate?(): void;
    /**
     * Called when gameObject.active is set to false.
     */
    onDeactivate?(): void;
    /**
     * Override in subclass to initialize component.
     * Basic component properties are now available.
     * This component is also now in the gameObjects own component map.
     */
    init?(): void;
    onEnable?(): void;
    onDisable?(): void;
    /**
     *
     * @param delta - Tick time in seconds.
     */
    update?(delta: number): void;
    /**
     *
     * @param {class} cls - class to add to the component's game object.
     * @returns {Component}
     */
    add(cls: Component): Component;
    /**
     * Add a component already instantiated. Wraps gameObject.addExisting()
     * @param {Component} comp
     * @returns {Component} The added component instance.
     */
    addInstance(comp: Component, cls?: Constructor<Component>): Component;
    /**
     * Add a component already instantiated. Wraps gameObject.addExisting()
     * @deprecated Use addInstance()
     * @param {Component} comp
     * @returns {Component} The added component instance.
     */
    addExisting(comp: Component, cls?: Constructor<Component>): Component;
    /**
     *
     * @param {class} cls - wrapper for gameObject get()
     * @returns {Component|null}
     */
    get<T extends Component>(cls: Constructor<T>): T | undefined;
    /**
     * Wraps GameObject require().
     * @param {*} cls
     * @returns {Component}
     */
    require<T extends Component>(cls: Constructor<T>): T;
    onDestroy?(): void;
    /**
     * Use to destroy a Component.
     * override onDestroy() to clean up your components.
     * Do not call _destroy() or destroy() directly.
     */
    destroy(): void;
    /**
     * calls destroy() and cleans up any variables.
     */
    _destroy(): void;
}
