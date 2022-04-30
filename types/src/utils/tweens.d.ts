import { Tween } from '@tweenjs/tween.js';
/**
 * Gets active tween of target, if any.
 * @param targ
 * @returns
 */
export declare const getTween: <T>(targ: T) => Tween<T> | undefined;
/**
 * Gets active tween of target or creates a new tween if none exists.
 * @param targ
 * @returns
 */
export declare const tweenOf: <T>(targ: T) => Tween<T>;
export declare const removeTween: <T>(targ: T) => void;
