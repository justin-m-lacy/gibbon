import Actor from "../src/core/actor";
import type { DisplayObject, Point } from 'pixi.js';

/**
 * Pool for Actors.
 * Not fully developed.
 */
export class ActorPool {

	_objs: Actor[];

	constructor() {
		this._objs = [];
	}

	/**
	 * 
	 * @param {Actor} obj 
	 */
	add(obj: Actor) {
		this._objs.push(obj);
	}

	get(clip?: DisplayObject, pos?: Point) {

		if (this._objs.length === 0) {
			return new Actor(clip, pos);
		} else {

			const obj = this._objs.pop();
			//obj._reset(clip, pos);

			return obj;
		}

	}


}