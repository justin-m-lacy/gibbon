import { Point, DisplayObject, Container, InteractionEvent } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { quickSplice } from './utils/array-utils';
import Group from './group';
import Game from './game';
import Engine from './engine';
import Component from './component';
import { Constructor } from './utils/types';

/**
 * Point without reference to pixi.
 */
export interface IPoint {
	x: number,
	y: number
}

/**
 * Options for destroying a GameObject
 */
export type DestroyOptions = {

	children?: boolean | undefined,
	texture?: boolean | undefined,
	baseTexture?: boolean | undefined
};

/**
 *
 */
export default class GameObject {

	static Game: Game;
	static Engine: Engine;

	static SetGame(v: Game) { this.Game = v; }
	static GetGame() { return this.Game; }

	static GetEngine() { return this.Engine; }
	static SetEngine(v: Engine) { this.Engine = v; }

	/**
	 * @property {Game} game
	 */
	get game() { return GameObject.Game; }

	/**
	 * @property {Group} group - owning group of the gameObject, if any.
	 */
	get group(): Group | null { return this._group; }
	set group(v: Group | null) { this._group = v; }

	/**
	 * @property {string} name - Name of the GameObject.
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
				for (let comp of this._components) {
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
	get rotation(): number { return this.clip?.rotation ?? 0; }
	set rotation(v) {
		/// TODO: modulus these numbers.
		if (v > Math.PI) v -= 2 * Math.PI;
		else if (v < -Math.PI) v += 2 * Math.PI;
		if (this.clip != null) {
			this.clip.rotation = v;
		}
	}

	get width() { return this.clip?.getBounds().width ?? 0; }
	get height() { return this.clip?.getBounds().height ?? 0; }

	/**
	 * @property {boolean} interactive - Set the interactivity for the GameObject.
	 * The setting is ignored if the GameObject has no clip.
	 */
	get interactive() { return this.clip?.interactive ?? false }
	set interactive(v: boolean) {
		if (this.clip) {
			this.clip.interactive = v;
		}
	}

	get sleeping(): boolean {
		return this._sleep;
	}
	set sleep(v: boolean) {
		this._sleep = v;
	}

	/**
	 * @property {Point} orient - returns the normalized orientation vector of the object.
	 */
	get orient() {

		let rads = this.rotation;
		return new Point(Math.cos(rads), Math.sin(rads));

	}

	get visible() { return this.clip?.visible ?? false }
	set visible(v: boolean) {
		if (this.clip != null) {
			this.clip.visible = v;
		}
	}

	/**
	 * {Boolean} destroy was requested on the GameObject, and will be destroyed
	 * on the next frame. It should be treated as destroyed.
	 */
	/** get destroying() { return this._destroying; }
	set destroying() { this._destroying=true;}*/

	/**
	 * @property {boolean} isAdded - true after GameObject has been added to Engine.
	 */
	get isAdded() { return this._isAdded; }

	/**
	 * @property {boolean} destroyed
	 */
	get isDestroyed() { return this._destroyed }

	/**
	 * @property {DisplayObject} clip - clip of the gameObject.d.
	 */
	readonly clip?: DisplayObject | null;

	readonly _components: Component[];

	private _destroyed: boolean = false;

	/**
	 * Game object was added to engine.
	 */
	private _isAdded: boolean = false;

	readonly emitter: PIXI.utils.EventEmitter;

	protected _sleep: boolean = false;

	protected _name: string;

	protected _destroyOpts?: DestroyOptions;

	protected _active: boolean = false;

	protected _position: Point;

	protected _group: Group | null = null;

	flags: number = 0;

	readonly _compMap: Map<Constructor<Component> | Function, Component>;

	/**
	 *
	 * @param {DisplayObject} [clip=null]
	 * @param {Point} [pos=null]
	 */
	constructor(clip?: DisplayObject | null | undefined, pos?: Point | null) {

		this._components = [];
		this._compMap = new Map();

		this._isAdded = false;

		this._name = '';

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

			this.clip = null;
			this._position = pos || new Point(0, 0);

		}

		this._active = true;

		this.flags = 0;
		this.emitter = clip || new PIXI.utils.EventEmitter();
		this.clip = clip;

	}

	pause() { }
	unpause() {
	}

	/**
	 * Called when GameObject is added to engine.
	 * Calls init() on all components and self.added()
	 */
	_added() {

		this._isAdded = true;

		let len = this._components.length;
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
	 * Override in subclass.
	 */
	added() { }

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
	 * Emit an event through the underlying gameObject clip. If the gameObject
	 * does not contain a clip, the event is emitted through a custom emitter.
	 * @param {*} args - First argument should be the {string} event name.
	 */
	emit(event: string, ...args: any[]) {
		this.emitter.emit.call(this.emitter, event, ...args);
	}

	/**
	 * Wrap emitter off()
	 * @param  {...any} args
	 */
	off(e: string, fn?: PIXI.utils.EventEmitter.ListenerFn, context?: any) {
		this.emitter.off(e, fn, context);
	}

	/**
	 * @deprecated Use addInstance<> instead.
	 * @param inst 
	 * @param cls 
	 */
	addExisting<T extends Component>(inst: T, cls?: Constructor<T>): T {
		return this.addInstance(inst, cls);
	}

	/**
	 * Add an existing component to the GameObject.
	 * @param {Component} inst
	 * @param {?Object} [cls=null]
	 * @returns {Component} Returns the instance.
	 */
	addInstance<T extends Component>(inst: T, cls?: Constructor<T>): T {

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
	 * Instantiate and add a component to the GameObject.
	 * @param {class} cls - component class to instantiate.
	 * @returns {Object}
	*/
	add<T extends Component>(cls: T | Constructor<T>): T {
		if (cls instanceof Component) {
			return this.addInstance(cls);
		} else {
			return this.addInstance(new cls(), cls);
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

		let clip = this.clip;
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
		this._position.x += x;
		this._position.y += y;
	}

	/**
	 * Determine if GameObject contains a Component entry
	 * under class or key cls.
	 * @param {*} cls - class or key of component.
	 */
	has(cls: Constructor<Component>) {
		return this._compMap.has(cls);
	}

	/**
	 *
	 * @param {*} cls
	 */
	get<T extends Component>(cls: Constructor<T>): T | undefined {

		let inst = this._compMap.get(cls) as T;
		if (inst !== undefined) return inst;

		for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls) return this._components[i] as T;
		}
		return undefined;

	}

	/**
	 *
	 * @param {*} cls
	 */
	require<T extends Component>(cls: Constructor<T>): T {

		let inst = this._compMap.get(cls);
		if (inst !== undefined && inst instanceof cls) return inst as T;

		for (let i = this._components.length - 1; i >= 0; i--) {
			if (this._components[i] instanceof cls) return this._components[i] as T;
		}
		return this.add(cls);

	}

	/**
	 * Creates a copy of the given component and adds it
	 * to this GameObject.
	 * @param {Component} comp
	 */
	addCopy(comp: Component) {

		let copy = Object.assign(
			Object.create(Object.getPrototypeOf(comp)),
			comp);

		return this.addInstance(copy);

	}

	/**
	 *
	 * @param {number} delta
	 */
	update(delta: number) {

		let comps = this._components;

		for (let i = comps.length - 1; i >= 0; i--) {

			var comp = comps[i];
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


		//let ind = this._components.indexOf( comp);
		//if ( ind < 0) return false;

		//this._components.splice(ind, 1);
		//this.components[ind] = this.components[ this.components.length-1];
		//this.components.pop();

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
	 * the GameObject is destroyed.
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

		let comps = this._components;

		for (let i = comps.length - 1; i >= 0; i--) {
			this.remove(comps[i]);
		}

	}

	/**
	 * destroys all components and then the GameObject itself.
	 */
	_destroy() {

		this.emitter.emit('destroy', this);
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