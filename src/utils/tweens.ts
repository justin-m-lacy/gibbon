import { Group, Tween } from 'tweedle.js';

const tweens = new WeakMap<any, Tween<any>>();
const groups = new WeakMap<any, Group>();


export const getTweenGroup = <T extends object>(targ: T): Group | undefined => {
    return groups.get(targ) as Group;
}

/**
 * Gets active tween of target, if any.
 * @param targ 
 * @returns 
 */
export const getTween = <T extends object>(targ: T): Tween<T> | undefined => {
    return tweens.get(targ) as Tween<T>;
}

/**
 * Gets active tween of target or creates a new tween if none exists.
 * @param targ 
 * @returns 
 */
export const tweenOf = <T extends object>(targ: T, group?: Group): Tween<T> => {
    let cur = tweens.get(targ,) as Tween<T>;
    if (cur) {
        return cur;
    } else {
        cur = new Tween(targ, group);
        tweens.set(targ, cur);
        return cur;
    }
}

export const removeTween = <T>(targ: T) => {
    tweens.delete(targ);
}