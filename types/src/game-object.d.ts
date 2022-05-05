import { Point, DisplayObject } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Group from './group';
import Game from './game';
import Component from './component';
import { Constructor } from './utils/types';
/**
 * Point without reference to pixi.
 */
export interface IPoint {
    x: number;
    y: number;
}
/**
 * Options for destroying a GameObject
 */
export declare type DestroyOptions = {
    children?: boolean | undefined;
    texture?: boolean | undefined;
    baseTexture?: boolean | undefined;
};
/**
 *
 */
export default class GameObject {
    /**
     * @property {Game} game
     */
    get game(): Game;
    /**
     * @property {Group} group - owning group of the gameObject, if any.
     */
    get group(): Group | null;
    set group(v: Group | null);
    /**
     * @property {string} name - Name of the GameObject.
     */
    get name(): string;
    set name(v: string);
    /**
     * @property {boolean} active
     */
    get active(): boolean;
    set active(v: boolean);
    /**
     * @property {Point} position - Position of the object and Display clip.
     */
    get position(): Point;
    set position(v: Point);
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
     * @property {number} rotation - Rotation in radians.
     */
    get rotation(): number;
    set rotation(v: number);
    get width(): number;
    get height(): number;
    /**
     * @property {boolean} interactive - Set the interactivity for the GameObject.
     * The setting is ignored if the GameObject has no clip.
     */
    get interactive(): boolean;
    set interactive(v: boolean);
    get sleeping(): boolean;
    set sleep(v: boolean);
    /**
     * @property {Point} orient - returns the normalized orientation vector of the object.
     */
    get orient(): Point;
    get visible(): boolean;
    set visible(v: boolean);
    /**
     * {Boolean} destroy was requested on the GameObject, and will be destroyed
     * on the next frame. It should be treated as destroyed.
     */
    /** get destroying() { return this._destroying; }
    set destroying() { this._destroying=true;}*/
    /**
     * @property {boolean} isAdded - true after GameObject has been added to Engine.
     */
    get isAdded(): boolean;
    /**
     * @property {boolean} destroyed
     */
    get isDestroyed(): boolean;
    /**
     * @property {DisplayObject} clip - clip of the gameObject.d.
     */
    readonly clip?: DisplayObject | null;
    readonly _components: Component[];
    private _destroyed;
    /**
     * Game object was added to engine.
     */
    private _isAdded;
    readonly emitter: PIXI.utils.EventEmitter;
    protected _sleep: boolean;
    protected _name: string;
    protected _destroyOpts?: DestroyOptions;
    protected _active: boolean;
    protected _position: Point;
    protected _group: Group | null;
    private _game;
    flags: number;
    readonly _compMap: Map<Constructor<Component> | Function, Component>;
    /**
     *
     * @param {DisplayObject} [clip=null]
     * @param {Point} [pos=null]
     */
    constructor(clip?: DisplayObject | null | undefined, pos?: Point | null);
    pause(): void;
    unpause(): void;
    /**
     * Called when GameObject is added to engine.
     * Calls init() on all components and self.added()
     */
    _added(): void;
    /**
     * Override in subclass.
     */
    added(): void;
    /**
     *
     * @param {string} evt
     * @param {function} func
     * @param {*} [context=null]
     * @returns {PIXI.utils.EventEmitter}
     */
    on(evt: string, func: PIXI.utils.EventEmitter.ListenerFn, context?: any): PIXI.utils.EventEmitter<string | symbol>;
    /**
     * Emit an event through the underlying gameObject clip. If the gameObject
     * does not contain a clip, the event is emitted through a custom emitter.
     * @param {*} args - First argument should be the {string} event name.
     */
    emit(event: string, ...args: any[]): void;
    /**
     * Wrap emitter off()
     * @param  {...any} args
     */
    off(e: string, fn?: PIXI.utils.EventEmitter.ListenerFn, context?: any): void;
    /**
     * @deprecated Use addInstance<> instead.
     * @param inst
     * @param cls
     */
    addExisting<T extends Component>(inst: T, cls?: Constructor<T>): T;
    /**
     * Add an existing component to the GameObject.
     * @param {Component} inst
     * @param {?Object} [cls=null]
     * @returns {Component} Returns the instance.
     */
    addInstance<T extends Component>(inst: T, cls?: Constructor<T>): T;
    /**
     * Instantiate and add a component to the GameObject.
     * @param {class} cls - component class to instantiate.
     * @returns {Object}
    */
    add<T extends Component>(cls: T | Constructor<T>): T;
    /**
     * Checks if the Object's clip contains a global point.
     * Always false for objects without clips or clip.hitAreas.
     * @param {Vector|Object} pt
     * @param {number} pt.x
     * @param {number} pt.y
     * @returns {boolean}
     */
    contains(pt: Point): boolean;
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    translate(x: number, y: number): void;
    /**
     * Determine if GameObject contains a Component entry
     * under class or key cls.
     * @param {*} cls - class or key of component.
     */
    has(cls: Constructor<Component>): boolean;
    /**
     *
     * @param {*} cls
     */
    get<T extends Component>(cls: Constructor<T>): T | undefined;
    /**
     *
     * @param {*} cls
     */
    require<T extends Component>(cls: Constructor<T>): T;
    /**
     * Creates a copy of the given component and adds it
     * to this GameObject.
     * @param {Component} comp
     */
    addCopy(comp: Component): any;
    /**
     *
     * @param {number} delta
     */
    update(delta: number): void;
    /**
     *
     * @param {Component} comp - the component to remove from the game object.
     * @param {bool} [destroy=true] - whether the component should be destroyed.
     */
    remove(comp: Component, destroy?: boolean): boolean;
    show(): void;
    hide(): void;
    /**
     * Set options for destroying the PIXI DisplayObject when
     * the GameObject is destroyed.
     * @param {boolean} children
     * @param {boolean} texture
     * @param {boolean} baseTexture
     */
    setDestroyOpts(children: boolean, texture: boolean, baseTexture: boolean): void;
    /**
     * Call to destroy the game Object.
     * Do not call _destroy() directly.
     */
    destroy(): void;
    /**
     * destroys all components and then the GameObject itself.
     */
    _destroy(): void;
}
