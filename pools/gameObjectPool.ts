import GameObject from "../src/actor";
import { DisplayObject, Point } from 'pixi.js';

/**
 * Pool for GameObjects.
 * Not fully developed.
 */
export default class GameObjectPool {

	_objs: GameObject[];

	constructor() {
		this._objs = [];
	}

	/**
	 * 
	 * @param {GameObject} obj 
	 */
	add(obj: GameObject) {
		this._objs.push(obj);
	}

	get(clip?: DisplayObject, pos?: Point) {

		if (this._objs.length === 0) {
			return new GameObject(clip, pos);
		} else {

			let obj = this._objs.pop();
			//obj._reset(clip, pos);

			return obj;
		}

	}


}