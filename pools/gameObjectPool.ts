import { Actor } from "../src/core/actor";
import type { DisplayObject } from 'pixi.js';
import { IPoint } from '../src/data/geom';

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

	get(clip?: DisplayObject, pos?: IPoint) {

		if (this._objs.length === 0) {
			return new Actor(clip, pos);
		} else {

			const obj = this._objs.pop();
			//obj._reset(clip, pos);

			return obj;
		}

	}


}