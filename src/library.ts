import { IPoint } from './data/geom';
import { Constructor, isConstructor, Clonable, isClonable } from './utils/types';
import type { Actor } from './core/actor';

/// Function to create instances of game objects.
export type CreateFunction = (...params: any[]) => Actor;

export class Library {

	_lib: Map<string, Constructor<any> | Clonable<any> | Object> = new Map();

	constructor() { }

	/**
	 * 
	 * @param {string} name 
	 * @param {Object|function} item - function(position) to create an object,
	 * an Object with a clone() function, or a plain object to return.
	 */
	addItem<T extends Object>(name: string, item: Constructor<T> | Clonable<T> | T) {
		this._lib.set(name, item);
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {?Object} Object created, or null.
	 */
	instance<T>(name: string, p?: IPoint | null) {

		const item = this._lib.get(name);
		if (!item) return null;

		if (isConstructor<T>(item)) {
			const type = new item();
		} else if (isClonable<T>(item)) return item.clone();
		else return item as T;


	}

}