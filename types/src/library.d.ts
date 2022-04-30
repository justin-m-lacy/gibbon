import { Point } from 'pixi.js';
import { Constructor, Clonable } from './utils/types';
export default class Library {
    _lib: Map<string, Constructor<any> | Clonable | Object>;
    constructor();
    /**
     *
     * @param {string} name
     * @param {Object|function} item - function(position) to create an object,
     * an Object with a clone() function, or a plain object to return.
     */
    addItem(name: string, item: Constructor<any> | Clonable | Object): void;
    /**
     *
     * @param {string} name
     * @param {Point|?Object} [p=null] - point to place instance.
     * @returns {?Object} Object created, or null.
     */
    instance(name: string, p?: Point | null): any;
}
