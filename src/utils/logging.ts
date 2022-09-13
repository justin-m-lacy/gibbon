import { RAD_TO_DEG } from "pixi.js";

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