import { RAD_TO_DEG, DisplayObject } from 'pixi.js';
import { Component } from '../core/component';
import { Constructor } from './types';
import { Group } from '../core/group';

/**
 * Log a message at percent frequency. For logs that would otherwise
 * be too frequent.
 * @param message 
 * @param pct 
 */
export const rareLog = (message: string, pct: number = 5) => {
    if (100 * Math.random() < pct) {
        console.log(message);
    }
}


/**
 * Convert radian to a rounded degree string.
 * @param rad - angle in radians.
 */
export const formatRadians = (rad: number, precision: number = 1) => {
    return `${(rad * RAD_TO_DEG).toFixed(precision)}`;

}



/**
 * Warn missing component.
 * @param component 
 * @param source 
 */
export const warnMissingComponent = <T extends DisplayObject>(component: Component<T> | Constructor<Component<T>>, source: Function) => {

    console.warn(`${source.name}: Component ${component} Missing`);
}

export const warnMissingGroup = <G extends Group>(g: G | Constructor<G>, source: Function) => {

    console.warn(`${source.name}: Group ${g} Missing`);
}