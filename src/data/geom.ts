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