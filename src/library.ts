import { Point } from 'pixi.js';
import { Constructor, isConstructor, Clonable, isClonable } from './utils/types';
import Actor from './core/actor';

/// Function to create instances of game objects.
export type CreateFunction = (...params: any[]) => Actor;

export default class Library {

	_lib: Map<string, Constructor<any> | Clonable<any> | Object> = new Map();

	constructor() { }

	/**
	 * 
	 * @param {string} name 
	 * @param {Object|function} item - function(position) to create an object,
	 * an Object with a clone() function, or a plain object to return.
	 */
	addItem<T>(name: string, item: Constructor<T> | Clonable<T> | T) {
		this._lib.set(name, item);
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {Point|?Object} [p=null] - point to place instance.
	 * @returns {?Object} Object created, or null.
	 */
	instance<T>(name: string, p?: Point | null) {

		const item = this._lib.get(name);
		if (!item) return null;

		if (isConstructor<T>(item)) {
			const type = new item();
		} else if (isClonable<T>(item)) return item.clone();
		else return item as T;


	}

}