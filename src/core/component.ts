import Actor from "./actor";
import { Constructor } from '../utils/types';
import { DisplayObject } from 'pixi.js';

export default class Component {

	/**
	 * @property {Game} game
	 */
	get game() { return this.actor!.game; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this.game.engine; }

	/**
	 * @property {number} flags - Convenience accessor for Actor.flags.
	 */
	get flags() { return this.actor!.flags; }
	set flags(v) { this.actor!.flags = v; }

	/**
	 * Group controlling the component's Actor, if any.
	 */
	get group() { return this.actor?.group; }

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
	get x() { return this.actor?.x ?? 0; }
	set x(v) {
		if (this.actor) {
			this.actor.x = v;
		}
	}

	/**
	 * @property {number} y
	*/
	get y(): number { return this.actor?.y ?? 0; }
	set y(v) { if (this.actor != null) this.actor.y = v; }

	/**
	* @property {number} rotation - underlying clip rotation in radians.
	*/
	get rotation(): number { return this.actor?.rotation ?? 0; }
	set rotation(v: number) {
		if (this.actor) {
			this.actor.rotation = v;
		}
	}

	/**
	 * @property {PIXI.Point} position - only usable after init()
	 */
	get position() { return this.actor!.position; }
	set position(v) { this.actor!.position = v; }

	/**
	 * Indicates the component has been marked for disposal and should no longer
	 * be referenced.
	 * @property {Boolean} isDestroyed
	 */
	get isDestroyed() { return this._destroyed; }

	get sleep() { return this._sleep; }
	set sleep(v: boolean) { this._sleep = v; }

	/**
	 * @property {Actor} - Game object containing this component.
	 */
	actor?: Actor;

	_enabled: boolean = false;
	_destroyed: boolean = false;

	/**
	 * True if component should sleep.
	 */
	_sleep: boolean = false;


	/**
	 * @property clip - Convenience accessor of Actor clip.
	 */
	get clip() { return this.actor?.clip; }

	/**
	 * Constructor intentionally empty so components can be
	 * instantiated and added to Actors without
	 * knowledge of the underlying game system.
	 * @note component properties such as actor, clip, and game,
	 * are not available in component constructor.
	 */
	constructor() { }

	/**
	 * Private initializer calls subclassed init()
	 * @param {Actor} actor
	 */
	_init(actor: Actor) {

		this.actor = actor;
		this._enabled = true;

		this.init?.();

	}

	/**
	 * Called when actor.active is set to true.
	 */
	onActivate?(): void;

	/**
	 * Called when actor.active is set to false.
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
		return this.actor!.add(cls);
	}

	/**
	 * Add a component already instantiated. Wraps actor.addExisting()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addInstance(comp: Component, cls?: Constructor<Component>) {

		return this.actor!.addInstance(comp, cls);
	}

	/**
	 * Add a component already instantiated. Wraps actor.addExisting()
	 * @deprecated Use addInstance()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addExisting(comp: Component, cls?: Constructor<Component>) {

		return this.actor!.addInstance(comp, cls);
	}

	/**
	 *
	 * @param {class} cls - wrapper for actor get()
	 * @returns {Component|null}
	 */
	get<T extends Component>(cls: Constructor<T>): T | undefined {
		return this.actor!.get(cls);
	}

	/**
	 * Wraps Actor require().
	 * @param {*} cls
	 * @returns {Component}
	 */
	require<T extends Component>(cls: Constructor<T>): T { return this.actor!.require(cls); }

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
		this.actor = undefined;

	}

}