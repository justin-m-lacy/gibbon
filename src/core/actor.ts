import { Point, DisplayObject, Container, utils, DisplayObjectEvents } from 'pixi.js';
import type { Group } from './group';
import { Game } from '../game';
import { Component } from './component';
import { Constructor } from '../utils/types';
import { Transform } from './transform';
import { EngineEvent } from '../events/engine-events';
import type { IPoint } from '@/data/geom';


export type ComponentKey = Component | Constructor<Component>;

/**
 * Options for destroying a Actor
 */
export type DestroyOptions = {

	children?: boolean,
	texture?: boolean,
	baseTexture?: boolean
};

/**
 *
 */
export class Actor<T extends DisplayObject = DisplayObject, G extends Game = Game> {

	private static NextId: number = 1000;

	readonly id: number;

	/**
	 * @property {Game} game
	 */
	get game() { return Game.current as G; }

	/**
	 * @property {Group} group - owning group of the actor, if any.
	 */
	get group() { return this._group; }
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
				for (const comp of this._components) {
					comp.onDeactivate?.();
				}
			}

		}
	}


	/**
	 * @property {Point} position - Position of the object and Display clip.
	 */
	get position() { return this._position; }
	set position(v) { this._position.set(v.x, v.y); }

	/**
	 * @property x
	 */
	get x() { return this._position.x; }
	set x(v: number) { this._position.x = v; }

	/**
	 * @property y
	 */
	get y(): number { return this._position.y; }
	set y(v: number) { this._position.y = v; }

	/**
	 * @property rotation - Rotation in radians.
	 */
	get rotation() { return this._rotation; }
	set rotation(v) {
		if (v > 2 * Math.PI || v < -2 * Math.PI) v %= 2 * Math.PI;
		this._rotation = v;
		if (this.clip && this._autoRotate === true) {
			this.clip.rotation = v;
		}
	}

	get autoRotate() { return this._autoRotate }
	set autoRotate(v) { this._autoRotate = v }

	get width() { return this.clip?.getBounds().width ?? 0; }
	get height() { return this.clip?.getBounds().height ?? 0; }

	/**
	 * @property interactive - Set the interactivity for the Actor.
	 * The setting is ignored if the Actor has no clip.
	 */
	get interactive() { return this.clip?.interactive ?? false }
	set interactive(v: boolean) {
		if (this.clip) {
			this.clip.interactive = v;
		}
	}

	get sleeping() { return this._sleep; }
	set sleep(v: boolean) { this._sleep = v; }

	/**
	 * @property orient - returns the normalized orientation vector of the object.
	 */
	get orient() {
		return new Point(Math.cos(this._rotation), Math.sin(this._rotation));
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
	 * If true, actor display object will match actor's rotation.
	 */
	private _autoRotate: boolean = true;

	/**
	 * Game object was added to engine.
	 */
	private _isAdded: boolean = false;

	readonly emitter: utils.EventEmitter<DisplayObjectEvents>;

	protected _sleep: boolean = false;

	protected _name: string = '';

	protected _destroyOpts?: DestroyOptions;

	protected _active: boolean = false;

	private _rotation: number = 0;

	protected _position: Point;

	protected _group: Group | null = null;

	readonly transform: Transform = new Transform();

	flags: number = 0;

	private readonly _compMap: Map<Constructor<Component> | Function, Component> = new Map();

	/**
	 * List of components waiting to be added next update.
	 * Components cannot add while actor is updating.
	 */
	private _toAdd: Component<any>[] = [];

	/**
	 *
	 * @param [clip=null]
	 * @param [pos=null]
	 */
	constructor(clip?: T | null, pos?: IPoint | null) {

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

			this._position = new Point(pos?.x, pos?.y);

		}

		this._active = true;

		this.emitter = clip ?? new utils.EventEmitter();
		this.clip = clip ?? undefined;

	}

	/**
	 * Override in subclass.
	 */
	added(): void { }

	/**
	 * Called by Engine when Actor is added to engine.
	 * Calls init() on all components and self.added()
	 */
	_added() {

		this._isAdded = true;

		/// add components waiting.
		this._addNew();

		const len = this._components.length;
		for (let i = 0; i < len; i++) {
			this._components[i]._init(this);
		}
		if (this._active) {
			for (let i = 0; i < len; i++) {
				this._components[i].onActivate?.();
			}
		}

		this.added();

	}



	/**
	 *
	 * @param evt
	 * @param func
	 * @returns
	 */
	on(evt: string, func: utils.EventEmitter.ListenerFn, context?: any) {
		if (this.clip != null) {
			return this.clip.on(evt, func, context);
		}
		else {
			return this.emitter.on(evt, func, context);
		}
	}

	/**
	 * Wrap emitter off()
	 * @param  {...any} args
	 */
	off(e: string, fn?: utils.EventEmitter.ListenerFn, context?: any) {
		this.emitter.off(e, fn, context);
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
	 * Add an existing component to the Actor.
	 * @param {Component} inst
	 * @param {?Object} [cls=null]
	 * @returns {Component} Returns the instance.
	 */
	public addInstance<C extends Component>(inst: C, cls?: Constructor<C>): C {

		const key = cls ?? (<any>inst).constructor ?? Object.getPrototypeOf(inst).constructor ?? inst;

		this._compMap.set(key, inst);
		this._toAdd.push(inst);

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
		if (inst) return inst;

		for (const comp of this._compMap.values()) {
			if (comp instanceof cls) return comp as C;
		}
		/*for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls) return this._components[i] as C;
		}*/

		return undefined;

	}

	/**
	 *
	 * @param {*} cls
	 */
	require<C extends Component>(cls: Constructor<C>, ...args: any[]): C {

		const inst = this._compMap.get(cls);
		if (inst) return inst as C;

		for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls && !this._components[i].isDestroyed) return this._components[i] as C;
		}
		return this.add(cls, ...args);

	}

	/**
	 *
	 * @param {number} delta - Tick time in seconds.
	 */
	update(delta: number) {

		const comps = this._components;

		let destroyed = 0;

		this._addNew();

		for (let i = comps.length - 1; i >= 0; i--) {

			const comp = comps[i];
			if (comp._destroyed === true) {
				destroyed++;
				continue;
			}
			if (comp.update && comp.enabled === true) {
				comp.update(delta);
			}

		}

		this._removeDestroyed(destroyed);

	}

	/**
	 * Add waiting components to component list.
	 */
	_addNew() {

		if (this._toAdd.length > 0) {
			this._components.push.apply(this._components, this._toAdd);
			this._components.sort((a, b) => a.priority - b.priority);
			this._toAdd.length = 0;
		}

	}

	/**
	 * Remove destroyed components at the end of update.
	 */
	_removeDestroyed(count: number) {

		const comps = this._components;
		const len = comps.length;

		/// Slide down non-destroyed components over the destroyed ones.
		/// Move destroyed components forward until they reach end.
		for (let i = 0; i < len; i++) {

			const c = comps[i];
			if (!c._destroyed) {

				/// slide down until a non-destroyed component is hit.
				let j = i - 1;
				while (j >= 0) {

					if (!comps[j]._destroyed) {
						break;
					} else {
						j--;
					}
				}
				/// swap destroyed component ahead. 
				if (++j < i) {
					comps[i] = comps[j];
					comps[j] = c;
				}

			}

		}

		///  all destroyed components are now at the end of the array.
		while (count--) {
			comps.pop();
		}


	}

	/**
	 *
	 * @param {Component} comp - the component to remove from the game object.
	 * @param {bool} [destroy=true] - whether the component should be destroyed.
	 */
	remove(comp: Component | Constructor<Component>, destroy: boolean = true) {

		if (!(comp instanceof Component)) {
			const val = this._compMap.get(comp);
			if (val) {
				comp = val;
			} else {
				return false;
			}
		}

		if (destroy === true) comp.destroy();

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

		if (this._destroyed === true) {
			return;
		}

		this._destroyed = true;

		this.emitter.emit(EngineEvent.ActorDestroyed, this);

		const comps = this._components;

		for (let i = comps.length - 1; i >= 0; i--) {
			this.remove(comps[i]);
		}
		if (this._group) {
			this._group?.remove(this);
			this._group = null;
		}

	}

	/**
	 * destroys all components and then the Actor itself.
	 */
	_destroy() {


		this.emitter.removeAllListeners();
		if (this.clip) {
			if (this.clip instanceof Container && this._destroyOpts) {
				this.clip.destroy(this._destroyOpts);
				this._destroyOpts = undefined;
			} else {
				this.clip.destroy();
			}
		}

	}

}