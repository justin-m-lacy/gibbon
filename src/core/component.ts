import type { Actor } from "./actor";
import { Constructor } from '../utils/types';
import type { DisplayObject } from 'pixi.js';
import type { Game } from "@/game";
import { EngineEvent } from '../events/engine-events';

export const BasePriority = 3000;
export class Component<T extends DisplayObject = DisplayObject, G extends Game = Game> {
	public readonly _isComponent = true;

	/**
	 * @property game
	 */
	get game(): G | undefined { return this.actor!.game; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this.game?.engine; }

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

		if (this._enabled === v) {
			return;
		}
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
	 * @property position - only usable after init()
	 */
	get position() { return this.actor!.position; }
	set position(v) { this.actor!.position = v; }

	/**
	 * Indicates the component has been marked for disposal and should no longer
	 * be referenced.
	 * @property {Boolean} isDestroyed
	 */
	get isDestroyed() { return this._destroyed; }

	/**
	 * Priority of component. Higher priority components'
	 * update functions are updated before lower priority.
	 * (0 is lowest priority.)
	 * Priority should not be changed once a component is
	 * added to an Actor.
	 */
	priority: number = BasePriority;

	/**
	 * @property  - Game object containing this component.
	 */
	actor?: Actor<T, G>;

	/**
	 * @private
	 */
	_enabled: boolean = true;

	/**
	 * @private
	 */
	_destroyed: boolean = false;


	/**
	 * @property clip - Convenience accessor of Actor clip.
	 */
	get clip() { return this.actor?.clip; }

	/**
	 * Constructor intentionally empty so components can be
	 * instantiated and added to Actors without
	 * knowledge of the underlying game system.
	 * @note component properties such as actor, clip, and game,
	 * are not available until init() is called by the Engine.
	 */
	constructor() { }

	/**
	 * Private initializer calls subclassed init()
	 * @param {Actor} actor
	 */
	_init(actor: Actor<T, G>) {

		this.actor = actor;
		this.init?.();

		if (this.enabled) {
			this.onEnable?.();
		}
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
	 * Emit event through owning actor's emitter..
	 * @param evt 
	 * @param args 
	 */
	emit(evt: string, ...args: any[]) {
		this.actor!.emit(evt, ...args);
	}

	/**
	 * Add a component already instantiated.
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	add<C extends Component>(comp: C | Constructor<C>, cls?: Constructor<C>): C {

		return this.actor!.add(comp, cls);
	}

	/**
	 *
	 * @param {class} cls - wrapper for actor get()
	 * @returns {Component|null}
	 */
	get<C extends Component>(cls: Constructor<C>): C | undefined {
		return this.actor!.get(cls);
	}

	/**
	 * Wraps Actor require().
	 * @param {*} cls
	 * @returns {Component}
	 */
	require<C extends Component>(cls: Constructor<C>): C { return this.actor!.require(cls); }

	/**
	 * Override in subclasses to clean up before component destroyed.
	 */
	onDestroy?(): void;

	/**
	 * Use to destroy a Component.
	 * override onDestroy() to clean up your components.
	 */
	destroy() {

		if (this._destroyed === true) {
			return;
		}

		this.enabled = false;
		this.actor?.emit(
			EngineEvent.ComponentDestroyed, this);

		this.onDestroy?.();

		this._destroyed = true;
		this.actor = undefined;
	}

}