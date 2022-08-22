import { Point } from 'pixi.js';
import { Constructor, Clonable } from './utils/types';
import GameObject from './core/game-object';
export declare type CreateFunction = (...params: any[]) => GameObject;
export default class Library {
    _lib: Map<string, Constructor<any> | Clonable<any> | Object>;
    constructor();
    /**
     *
     * @param {string} name
     * @param {Object|function} item - function(position) to create an object,
     * an Object with a clone() function, or a plain object to return.
     */
    addItem<T>(name: string, item: Constructor<T> | Clonable<T> | T): void;
    /**
     *
     * @param {string} name
     * @param {Point|?Object} [p=null] - point to place instance.
     * @returns {?Object} Object created, or null.
     */
    instance<T>(name: string, p?: Point | null): T | null | undefined;
}
