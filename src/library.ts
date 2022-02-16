import { Point } from 'pixi.js';
import { Constructor, isConstructor, Clonable, isClonable } from './utils/types';



export default class Library {

	_lib: Map<string, Constructor<any> | Clonable | Object> = new Map();

	constructor() { }

	/**
	 * 
	 * @param {string} name 
	 * @param {Object|function} item - function(position) to create an object,
	 * an Object with a clone() function, or a plain object to return.
	 */
	addItem(name: string, item: Constructor<any> | Clonable | Object) {
		this._lib.set(name, item);
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {Point|?Object} [p=null] - point to place instance.
	 * @returns {?Object} Object created, or null.
	 */
	instance(name: string, p?: Point | null) {

		let item = this._lib.get(name);
		if (!item) return null;

		if (isConstructor(item)) {
			let type = new item();
		} else if (isClonable(item)) return item.clone();
		else return item;


	}

}