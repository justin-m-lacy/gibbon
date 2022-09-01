import { Actor } from './core/actor';
import { Library } from './library';
import { quickSplice } from './utils/array-utils';
import { Point, DisplayObject, Container, Ticker } from 'pixi.js';

export interface IUpdater {

	/**
	 * 
	 * @param delta - time transpired in seconds.
	 */
	update(delta: number): void;
}

export class Engine implements IUpdater {

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

	readonly ticker: Ticker;

	constructor(ticker?: Ticker) {

		this.objects = [];
		this.updaters = [];

		this.library = new Library();

		this.ticker = ticker ?? new Ticker();
		this.ticker.add(this.update, this);

	}

	/**
	 * Instantiate a Actor with a clip or a named clonable object from the library.
	 * @param clip
	 * @param loc
	 * @returns {Actor}
	 */
	Instantiate<T extends DisplayObject>(clip: T | null | string = null, loc?: Point | null) {

		const view = (typeof clip === 'string') ? this.library.instance<DisplayObject>(clip, loc) : clip;
		const go = new Actor(view ?? undefined, loc);

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

			const obj = objs[i];
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

		const ind = this.updaters.indexOf(sys);
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

		const ind = this.objects.indexOf(obj);
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