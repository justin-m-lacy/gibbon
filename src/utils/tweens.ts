import { Tween } from '@tweenjs/tween.js';

const tweens = new WeakMap<any, Tween<any>>();

/**
 * Gets active tween of target, if any.
 * @param targ 
 * @returns 
 */
export const getTween = <T extends Object>(targ: T): Tween<T> | undefined => {
    return tweens.get(targ) as Tween<T>;
}

/**
 * Gets active tween of target or creates a new tween if none exists.
 * @param targ 
 * @returns 
 */
export const tweenOf = <T extends Object>(targ: T): Tween<T> => {
    let cur = tweens.get(targ) as Tween<T>;
    if (cur) {
        return cur;
    } else {
        cur = new Tween(targ);
        tweens.set(targ, cur);
        return cur;
    }
}

export const removeTween = <T>(targ: T) => {
    tweens.delete(targ);
}