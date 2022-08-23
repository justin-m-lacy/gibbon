import * as PIXI from 'pixi.js';
import Actor from './core/actor';
import Library from './library';
import { quickSplice } from './utils/array-utils';
import { Point, DisplayObject, Container } from 'pixi.js';

export interface IUpdater {

	update(delta: number): void;
}

export default class Engine implements IUpdater {

	/**
	 * @property {Container} objectLayer
	 */
	objectLayer?: Container;

	/**
	 * @property {Actor[]} objects
	 */
	readonly objects: Actor[];

	/**
	 * @property {IUpdater[]} updaters - Updaters are for systems or objects with update
	 * functions that don't require complex Actors.
	 */
	readonly updaters: IUpdater[];

	readonly library: Library;

	readonly ticker: PIXI.Ticker;

	constructor(ticker?: PIXI.Ticker) {

		this.objects = [];
		this.updaters = [];

		this.library = new Library();

		this.ticker = ticker ?? new PIXI.Ticker();
		this.ticker.add(this.update, this);

	}

	/**
	 * Instantiate a Actor with a clip or a named clonable object from the library.
	 * @param {DisplayObject} [clip=null]
	 * @param {PIXI.Point} [loc=null]
	 * @returns {Actor}
	 */
	Instantiate(clip: DisplayObject | null | string = null, loc?: Point | null) {

		var view = (typeof clip === 'string') ? this.library.instance<DisplayObject>(clip, loc) : clip;
		let go = new Actor(view, loc);

		this.add(go);
		return go;

	}

	update() {

		const sec = this.ticker.deltaMS / 1000;
		const updaters = this.updaters;
		for (let i = updaters.length - 1; i >= 0; i--) {
			updaters[i].update(sec);
		}

		const objs = this.objects;

		for (let i = objs.length - 1; i >= 0; i--) {

			var obj = objs[i];
			if (obj.isDestroyed === true) {

				obj._destroy();
				quickSplice(objs, i);

			} else if (obj.active) obj.update(sec);

		}

	}

	start() {
		this.ticker.start();
	}

	stop() {
		this.ticker.stop();
	}

	/**
	 * Add Actor to the engine.
	 * @param {Actor} obj
	*/
	add(obj: Actor) {

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
	 * @param {IUpdater} sys
	 */
	addUpdater(sys: IUpdater) {
		this.updaters.push(sys);
	}

	/**
	 *
	 * @param {IUpdater} sys
	 */
	removeUpdater(sys: IUpdater) {

		let ind = this.updaters.indexOf(sys);
		if (ind >= 0) {
			this.updaters.splice(ind, 1);
		}

	}

	/**
	 * Remove a Actor from the Engine.
	 * @param {Actor} obj
	 * @returns {boolean} true if object was removed.
	 */
	remove(obj: Actor): boolean {

		let ind = this.objects.indexOf(obj);
		if (ind < 0) return false;

		this.objects.splice(ind, 0);

		//this._objects[ind] = this._objects[ this._objects.length-1];
		//this._objects.pop();

		return true;

	}

	/**
	 * Destroy a game object.
	 * @param {Actor} obj
	 */
	destroy(obj: Actor) {

		if (obj.isDestroyed !== true) {
			obj.destroy();
		}

	}

}