import GameObject from "./game-object";
import { Constructor } from '../utils/types';
import { DisplayObject } from 'pixi.js';
import Game from '../game';

export default class Component {

	/**
	 * @property {Game} game
	 */
	get game() { return this.gameObject!.game; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this.game.engine; }

	/**
	 * @property {number} flags - Convenience accessor for GameObject.flags.
	 */
	get flags() { return this.gameObject!.flags; }
	set flags(v) { this.gameObject!.flags = v; }

	/**
	 * Group controlling the component's GameObject, if any.
	 */
	get group() { return this.gameObject?.group; }

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
	get x() { return this.gameObject?.x ?? 0; }
	set x(v) {
		if (this.gameObject) {
			this.gameObject.x = v;
		}
	}

	/**
	 * @property {number} y
	*/
	get y(): number { return this.gameObject?.y ?? 0; }
	set y(v) { if (this.gameObject != null) this.gameObject.y = v; }

	/**
	* @property {number} rotation - underlying clip rotation in radians.
	*/
	get rotation(): number { return this.gameObject?.rotation ?? 0; }
	set rotation(v: number) {
		if (this.gameObject) {
			this.gameObject.rotation = v;
		}
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
	 * @property clip - Convenience accessor of GameObject clip.
	 */
	get clip() { return this.gameObject?.clip; }

	/**
	 * Constructor intentionally empty so components can be
	 * instantiated and added to GameObjects without
	 * knowledge of the underlying game system.
	 * @note component properties such as gameObject, clip, and game,
	 * are not available in component constructor.
	 */
	constructor() { }

	/**
	 * Private initializer calls subclassed init()
	 * @param {GameObject} gameObject
	 */
	_init(gameObject: GameObject) {

		this.gameObject = gameObject;
		this._enabled = true;

		this.init?.();

	}

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
	add(cls: Component): Component {
		return this.gameObject!.add(cls);
	}

	/**
	 * Add a component already instantiated. Wraps gameObject.addExisting()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addInstance(comp: Component, cls?: Constructor<Component>) {

		return this.gameObject!.addInstance(comp, cls);
	}

	/**
	 * Add a component already instantiated. Wraps gameObject.addExisting()
	 * @deprecated Use addInstance()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addExisting(comp: Component, cls?: Constructor<Component>) {

		return this.gameObject!.addInstance(comp, cls);
	}

	/**
	 *
	 * @param {class} cls - wrapper for gameObject get()
	 * @returns {Component|null}
	 */
	get<T extends Component>(cls: Constructor<T>): T | undefined {
		return this.gameObject!.get(cls);
	}

	/**
	 * Wraps GameObject require().
	 * @param {*} cls
	 * @returns {Component}
	 */
	require<T extends Component>(cls: Constructor<T>): T { return this.gameObject!.require(cls); }

	onDestroy?(): void;

	/**
	 * Use to destroy a Component.
	 * override onDestroy() to clean up your components.
	 * Do not call _destroy() or destroy() directly.
	 */
	destroy() { this._destroy(); }

	/**
	 * calls destroy() and cleans up any variables.
	 */
	_destroy() {

		if (this.onDestroy) {
			this.onDestroy();
		}
		this._enabled = false;
		this._destroyed = true;
		this.gameObject = undefined;

	}

}