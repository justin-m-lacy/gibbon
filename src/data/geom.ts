export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Geometric types in an attempt to reduce coupling to Pixi types.
 */


/**
 * Represents the most basic point object;
 * Possibly a value being passed to or from a server.
 */
export type TPoint = {
    x: number;
    y: number;
}

/**
 * Point without reference to pixi.
 */
export interface IPoint {
    x: number,
    y: number,

    set(x: number, y: number): this;
}

export type Rectangle = {
    x: number,
    y: number,
    width: number,
    height: number
}
export interface IRectangle {
    x: number,
    y: number,
    width: number,
    height: number,

    contains(pt: TPoint): boolean;
}
