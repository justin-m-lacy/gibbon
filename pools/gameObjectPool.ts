import Actor from "../src/actor";
import { DisplayObject, Point } from 'pixi.js';

/**
 * Pool for Actors.
 * Not fully developed.
 */
export default class ActorPool {

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

			let obj = this._objs.pop();
			//obj._reset(clip, pos);

			return obj;
		}

	}


}