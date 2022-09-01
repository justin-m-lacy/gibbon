import { Point, DisplayObject, Container } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { quickSplice } from '../utils/array-utils';
import { Game } from '../game';
import { Component } from './component';
import { Constructor } from '../utils/types';
import { Transform } from './transform';
import type { Group } from './group';
import { EngineEvent } from '../events/engine-events';
import EventEmitter from 'eventemitter3';

/**
 * Point without reference to pixi.
 */
export interface IPoint {
	x: number,
	y: number,
}

/**
 * Options for destroying a Actor
 */
export type DestroyOptions = {

	children?: boolean | undefined,
	texture?: boolean | undefined,
	baseTexture?: boolean | undefined
};

/**
 *
 */
export class Actor<T extends DisplayObject = DisplayObject> {

	private static NextId: number = 1000;

	readonly id: number;

	/**
	 * @property {Game} game
	 */
	get game() { return Game.current; }

	/**
	 * @property {Group} group - owning group of the actor, if any.
	 */
	get group(): Group | null { return this._group; }
	set group(v: Group | null) { this._group = v; }

	/**
	 * @property {string} name - Name of the Actor.
	 */
	get name() { return this._name; }
	set name(v) { this._name = v; }

	/**
	 * @property {boolean} active
	 */
	get active() { return this._active; }
	set active(v: boolean) {

		if (this._active != v) {
			this._active = v;

			if (v) {
				for (const comp of this._components) {
					comp.onActivate?.();
				}
			} else {
				this._components.every(v => v.onDeactivate?.());
			}

		}
	}


	/**
	 * @property {Point} position - Position of the object and Display clip.
	 */
	get position() { return this._position; }
	set position(v) { this._position.set(v.x, v.y); }

	/**
	 * @property {number} x
	 */
	get x(): number { return this._position.x; }
	set x(v: number) { this._position.x = v; }

	/**
	 * @property {number} y
	 */
	get y(): number { return this._position.y; }
	set y(v: number) { this._position.y = v; }

	/**
	 * @property {number} rotation - Rotation in radians.
	 */
	get rotation(): number { return this._rotation; }
	set rotation(v) {
		if (v > 2 * Math.PI || v < -2 * Math.PI) v %= 2 * Math.PI;
		this._rotation = v;
		if (this.clip != null) {
			this.clip.rotation = v;
		}
	}

	get width() { return this.clip?.getBounds().width ?? 0; }
	get height() { return this.clip?.getBounds().height ?? 0; }

	/**
	 * @property {boolean} interactive - Set the interactivity for the Actor.
	 * The setting is ignored if the Actor has no clip.
	 */
	get interactive() { return this.clip?.interactive ?? false }
	set interactive(v: boolean) {
		if (this.clip) {
			this.clip.interactive = v;
		}
	}

	get sleeping(): boolean { return this._sleep; }
	set sleep(v: boolean) { this._sleep = v; }

	/**
	 * @property {Point} orient - returns the normalized orientation vector of the object.
	 */
	get orient() {

		const rads = this.rotation;
		return new Point(Math.cos(rads), Math.sin(rads));

	}

	get visible() { return this.clip?.visible ?? false }
	set visible(v: boolean) {
		if (this.clip != null) {
			this.clip.visible = v;
		}
	}

	/**
	 * @property isAdded - true after Actor has been added to Engine.
	 */
	get isAdded() { return this._isAdded; }

	/**
	 * @property destroyed
	 */
	get isDestroyed() { return this._destroyed }

	/**
	 * @property clip - clip of the actor.d.
	 */
	readonly clip?: T;

	readonly _components: Component[] = [];

	/**
	 * Object was destroyed and should not be used any more.
	 */
	private _destroyed: boolean = false;

	/**
	 * Game object was added to engine.
	 */
	private _isAdded: boolean = false;

	readonly emitter: EventEmitter;

	protected _sleep: boolean = false;

	protected _name: string = '';

	protected _destroyOpts?: DestroyOptions;

	protected _active: boolean = false;

	private _rotation: number = 0;

	protected _position: Point;

	protected _group: Group | null = null;

	readonly transform: Transform = new Transform();

	flags: number = 0;

	readonly _compMap: Map<Constructor<Component> | Function, Component> = new Map();

	/**
	 *
	 * @param {DisplayObject} [clip=null]
	 * @param {Point} [pos=null]
	 */
	constructor(clip?: T, pos?: Point | null) {

		this.id = Actor.NextId++;

		if (clip != null) {

			if (pos) {
				clip.position.set(pos.x, pos.y);
			}
			this._position = clip.position;

			this._destroyOpts = {
				children: true,
				texture: false,
				baseTexture: false
			}
		} else {

			this._position = pos || new Point(0, 0);

		}

		this._active = true;

		this.emitter = clip || new EventEmitter();
		this.clip = clip;

	}

	/**
	 * Override in subclass.
	 */
	added(): void { }
	pause(): void { }
	unpause(): void { }

	/**
	 * Called by Engine when Actor is added to engine.
	 * Calls init() on all components and self.added()
	 */
	_added() {

		this._isAdded = true;

		const len = this._components.length;
		for (let i = 0; i < len; i++) {
			this._components[i]._init(this);
		}
		if (this._active) {
			console.log(`activating components...`);
			for (let i = 0; i < len; i++) {
				this._components[i].onActivate?.();
			}
		}

		this.added();

	}



	/**
	 *
	 * @param {string} evt
	 * @param {function} func
	 * @param {*} [context=null]
	 * @returns {PIXI.utils.EventEmitter}
	 */
	on(evt: string, func: PIXI.utils.EventEmitter.ListenerFn, context?: any) {
		if (this.clip != null) {
			return this.clip.on(evt, func, context);
		}
		else {
			return this.emitter.on(evt, func, context);
		}
	}

	/**
	 * Emit an event through the underlying actor clip. If the actor
	 * does not contain a clip, the event is emitted through a custom emitter.
	 * @param {*} args - First argument should be the {string} event name.
	 */
	emit(event: string, ...args: any[]) {
		this.emitter.emit(event, ...args);
	}

	/**
	 * Wrap emitter off()
	 * @param  {...any} args
	 */
	off(e: string, fn?: PIXI.utils.EventEmitter.ListenerFn, context?: any) {
		this.emitter.off(e, fn, context);
	}

	/**
	 * Add an existing component to the Actor.
	 * @param {Component} inst
	 * @param {?Object} [cls=null]
	 * @returns {Component} Returns the instance.
	 */
	addInstance<C extends Component>(inst: C, cls?: Constructor<C>): C {

		const key = cls ?? (<any>inst).constructor ?? Object.getPrototypeOf(inst).constructor ?? inst;

		this._components.push(inst);
		this._compMap.set(key, inst);

		if (this._isAdded) {
			inst._init(this);
			if (this._active) {
				inst.onActivate?.();
			}
		}

		return inst;

	}

	/**
	 * Instantiate and add a component to the Actor.
	 * @param {class} cls - component class to instantiate.
	 * @param args - arguments to pass to class constructor.
	 * @returns {Object}
	*/
	add<C extends Component>(cls: C | Constructor<C>, ...args: any[]): C {
		if (cls instanceof Component) {
			return this.addInstance(cls);
		} else {
			return this.addInstance(new cls(...args), cls);
		}
	}

	/**
	 * Checks if the Object's clip contains a global point.
	 * Always false for objects without clips or clip.hitAreas.
	 * @param {Vector|Object} pt
	 * @param {number} pt.x
	 * @param {number} pt.y
	 * @returns {boolean}
	 */
	contains(pt: Point): boolean {

		const clip = this.clip;
		if (clip == null) return false;
		if (!clip.hitArea) {
			return clip.getBounds().contains(pt.x, pt.y);
		}

		pt = clip.toLocal(pt);
		return clip.hitArea.contains(pt.x, pt.y);
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	translate(x: number, y: number) {
		this._position.set(this._position.x + x, this._position.y + y);
	}

	/**
	 * Determine if Actor contains a Component entry
	 * under class or key cls.
	 * @param {*} cls - class or key of component.
	 */
	has(cls: Constructor<Component<T>>) {
		return this._compMap.has(cls);
	}

	/**
	 *
	 * @param {*} cls
	 */
	get<C extends Component>(cls: Constructor<C>): C | undefined {

		const inst = this._compMap.get(cls) as C;
		if (inst !== undefined) return inst;

		for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls) return this._components[i] as C;
		}
		return undefined;

	}

	/**
	 *
	 * @param {*} cls
	 */
	require<C extends Component>(cls: Constructor<C>, ...args: any[]): C {

		const inst = this._compMap.get(cls);
		if (inst !== undefined && inst instanceof cls) return inst as C;

		for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls) return this._components[i] as C;
		}
		return this.add(cls, ...args);

	}

	/**
	 *
	 * @param {number} delta - Tick time in seconds.
	 */
	update(delta: number) {

		const comps = this._components;

		for (let i = comps.length - 1; i >= 0; i--) {

			const comp = comps[i];
			if (comp._destroyed === true) {

				quickSplice(comps, i);
				continue;
			}
			if (comp.update && comp.sleep !== true && comp.enabled === true) {
				comp.update(delta);
			}

		}

	}


	/**
	 *
	 * @param {Component} comp - the component to remove from the game object.
	 * @param {bool} [destroy=true] - whether the component should be destroyed.
	 */
	remove(comp: Component, destroy: boolean = true) {

		if (destroy === true) comp._destroy();

		this._compMap.delete(comp.constructor || comp);

		return true;

	}

	show() {
		if (this.clip != null) {
			this.clip.visible = true;
		}
	}
	hide() {

		if (this.clip != null) {
			this.clip.visible = false;
		}
	}

	/**
	 * Set options for destroying the PIXI DisplayObject when
	 * the Actor is destroyed.
	 * @param {boolean} children
	 * @param {boolean} texture
	 * @param {boolean} baseTexture
	 */
	setDestroyOpts(children: boolean, texture: boolean, baseTexture: boolean) {

		if (this._destroyOpts == null) {
			this._destroyOpts = {
				children: children,
				texture: texture,
				baseTexture: baseTexture

			};
		} else {
			this._destroyOpts.children = children;
			this._destroyOpts.texture = texture;
			this._destroyOpts.baseTexture = baseTexture;
		}



	}

	/**
	 * Call to destroy the game Object.
	 * Do not call _destroy() directly.
	 */
	destroy() {

		this._destroyed = true;

		const comps = this._components;

		for (let i = comps.length - 1; i >= 0; i--) {
			this.remove(comps[i]);
		}

	}

	/**
	 * destroys all components and then the Actor itself.
	 */
	_destroy() {

		this.emitter.emit(EngineEvent.ActorDestroyed, this);
		this.emitter.removeAllListeners();
		if (this.clip) {
			if (this.clip instanceof Container && this._destroyOpts) {
				this.clip.destroy(this._destroyOpts);
			} else {
				this.clip.destroy();
			}
		}

		/*this._position = null;
		this._emitter = null;
		this._compMap = null;
		this._components = null;*/

	}

}