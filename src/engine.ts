import * as PIXI from 'pixi.js';
import GameObject from './core/game-object';
import Library from './library';
import { quickSplice } from './utils/array-utils';
import { Point, DisplayObject, Container } from 'pixi.js';
import System from './system';

export interface IUpdater {

	update(delta: number): void;
}

export default class Engine implements IUpdater {

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
	 * Instantiate a GameObject with a clip or a named clonable object from the library.
	 * @param {DisplayObject} [clip=null]
	 * @param {PIXI.Point} [loc=null]
	 * @returns {GameObject}
	 */
	Instantiate(clip: DisplayObject | null | string = null, loc?: Point | null) {

		var view = (typeof clip === 'string') ? this.library.instance<DisplayObject>(clip, loc) : clip;
		let go = new GameObject(view, loc);

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