import GameObject from "./gameObject";
import { Constructor } from '../utils/types';
import { DisplayObject } from 'pixi.js';

export default class Component {

	/**
	 * @property {Game} game
	 */
	get game() { return GameObject.Game!; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return GameObject.Engine; }

	/**
	 * @property {number} flags - Convenience accessor for GameObject.flags.
	 */
	get flags() { return this.gameObject!.flags; }
	set flags(v) { this.gameObject!.flags = v; }

	/**
	 * @property {Group} group - Group controlling the component's GameObject, if any.
	 */
	get group() { return this.gameObject!._group; }

	/**
	 * @property {boolean} enabled - Whether the component is enabled.
	 */
	get enabled() { return this._enabled; }
	set enabled(v) {

		this._enabled = v;

		if (v === true) {
			this.onEnable?.();
		} else {
			this.onDisable?.();
		}

	}

	/**
	 * @property {number} x
	 */
	get x() { return this.clip?.x ?? 0; }
	set x(v) {
		if (this.clip != null) {
			this.clip.x = v;
		}
	}

	/**
	 * @property {number} y
	*/
	get y(): number { return this.clip?.y ?? 0; }
	set y(v) { if (this.clip != null) this.clip.y = v; }

	/**
	* @property {number} rotation - underlying clip rotation in radians.
	*/
	get rotation(): number { return this.clip?.rotation ?? 0; }
	set rotation(v: number) {

		/// TODO: modulus.
		if (v > Math.PI) v -= 2 * Math.PI;
		else if (v < -Math.PI) v += 2 * Math.PI;

		if (this.clip) this.clip.rotation = v;
	}

	/**
	 * @property {PIXI.Point} position - only usable after init()
	 */
	get position() { return this.gameObject!.position; }
	set position(v) { this.gameObject!.position = v; }

	/**
	 * Indicates the component has been marked for disposal and should no longer
	 * be referenced.
	 * @property {Boolean} isDestroyed
	 */
	get isDestroyed() { return this._destroyed; }

	get sleep() { return this._sleep; }
	set sleep(v: boolean) { this._sleep = v; }

	/**
	 * @property {GameObject} - Game object containing this component.
	 */
	gameObject?: GameObject;

	_enabled: boolean = false;
	_destroyed: boolean = false;

	/**
	 * True if component should sleep.
	 */
	_sleep: boolean = false;


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
	constructor() { }

	/**
	 * Override in subclass to initialize component.
	 * Basic component properties are now available.
	 */
	init() { }

	/**
	 * Private initializer calls subclassed init()
	 * @param {GameObject} gameObject
	 */
	_init(gameObject: GameObject) {

		this.gameObject = gameObject;
		this.clip = this.gameObject.clip;

		this._enabled = true;

		this.init();

	}

	onEnable?(): void;
	onDisable?(): void;
	update?(delta: number): void;

	/**
	 *
	 * @param {class} cls - class to add to the component's game object.
	 * @returns {Component}
	 */
	add(cls: Component): Component {
		return this.gameObject!.add(cls);
	}

	/**
	 * Add a component already instantiated. Wraps gameObject.addExisting()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addExisting(comp: Component, cls?: Constructor<Component>) {

		return this.gameObject!.addExisting(comp, cls);
	}

	/**
	 *
	 * @param {class} cls - wrapper for gameObject get()
	 * @returns {Component|null}
	 */
	get(cls: Constructor<Component>): Component | null {
		return this.gameObject!.get(cls);
	}

	/**
	 * Wraps GameObject require().
	 * @param {*} cls
	 * @returns {Component}
	 */
	require(cls: Constructor<Component>): Component { return this.gameObject!.require(cls); }

	/**
	 * Use to destroy a Component.
	 * override destroy() to clean up your components.
	 * Do not call _destroy() or destroy() directly.
	 */
	destroy() { this._destroy(); }

	/**
	 * calls destroy() and cleans up any variables.
	 */
	_destroy() {

		if (this.destroy) this.destroy();
		this._enabled = false;
		this._destroyed = true;
		this.clip = null;
		this.gameObject = undefined;

	}

}