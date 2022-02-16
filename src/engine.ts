import * as PIXI from 'pixi.js';
import GameObject from './gameObject';
import Library from './library';
import { quickSplice } from './utils/array-utils';
import Factory from './factory';
import { Point, DisplayObject, Container } from 'pixi.js';
import System from './system';

export interface IUpdater {

	update(delta: number): void;
}

export default class Engine {

	/**
	 * @property {Container} objectLayer
	 */
	objectLayer?: Container;

	/**
	 * @property {GameObject[]} objects
	 */
	readonly objects: GameObject[];

	/**
	 * @property {IUpdater[]} updaters - Updaters are for systems or objects with update
	 * functions that don't require complex GameObjects.
	 */
	readonly updaters: IUpdater[];

	/*get ticker() {return this._ticker; }
	set ticker(v) { this._ticker =v; }

	get sharedTicker() { return this._sharedTicker; }
	set sharedTicker(v) { this._sharedTicker=v;}*/

	readonly library: Library;
	factory: Factory | null = null;

	constructor() {

		this.objects = [];
		this.updaters = [];

		this.library = new Library();

		this.factory = null;

		//this.ticker = PIXI.Ticker.shared;

		GameObject.SetEngine(this);
	}

	/**
	 *
	 * @param {string} key
	 * @param {Point} [loc=null]
	 * @param {Object} [vars=null] variables to use in creating the new object.
	 * @returns {GameObject}
	 */
	Create(key: string, loc: Point | null = null, vars: Object | null = null): GameObject | null {

		let go = this.factory!.create(key, loc, vars);
		if (go) {
			this.add(go);
		}

		return go;
	}

	/**
	 * Instantiate a GameObject with a clip or a named clonable object from the library.
	 * @param {DisplayObject} [clip=null]
	 * @param {PIXI.Point} [loc=null]
	 * @returns {GameObject}
	 */
	Instantiate(clip: DisplayObject | null | string = null, loc?: Point | null) {

		var src = (typeof clip === 'string') ? this.library.instance(clip, loc) : clip;
		let go = new GameObject(src, loc);

		this.add(go);
		return go;

	}

	start() {
	}

	stop() {
	}

	/**
	 * Add GameObject to the engine.
	 * @param {GameObject} obj
	*/
	add(obj: GameObject) {

		if (obj === null || obj === undefined) {
			console.log('ERROR: engine.add() object is null');
			return;
		}

		if (obj.clip != null && obj.clip.parent == null) {
			this.objectLayer!.addChild(obj.clip);
		}

		obj._added();

		this.objects.push(obj);

	}

	/**
	 *
	 * @param {System|Object} sys
	 */
	addUpdater(sys: System | IUpdater) {
		this.updaters.push(sys);
	}

	/**
	 *
	 * @param {System|IUpdater} sys
	 */
	removeUpdater(sys: IUpdater) {

		let ind = this.updaters.indexOf(sys);
		if (ind >= 0) {
			this.updaters.splice(ind, 1);
		}

	}

	update(delta: number) {

		const updaters = this.updaters;
		for (let i = updaters.length - 1; i >= 0; i--) {
			updaters[i].update(delta);
		}

		const objs = this.objects;

		for (let i = objs.length - 1; i >= 0; i--) {

			var obj = objs[i];
			if (obj.isDestroyed === true) {

				obj._destroy();
				quickSplice(objs, i);

			} else if (obj.active) obj.update(delta);

		}

	}

	/**
	 * Remove a GameObject from the Engine.
	 * @param {GameObject} obj
	 * @returns {boolean} true if object was removed.
	 */
	remove(obj: GameObject): boolean {

		let ind = this.objects.indexOf(obj);
		if (ind < 0) return false;

		this.objects.splice(ind, 0);

		//this._objects[ind] = this._objects[ this._objects.length-1];
		//this._objects.pop();

		return true;

	}

	/**
	 * Destroy a game object.
	 * @param {GameObject} obj
	 */
	destroy(obj: GameObject) {

		if (obj.isDestroyed !== true) {
			obj.destroy();
		}

	}

}