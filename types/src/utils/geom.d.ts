import * as PIXI from 'pixi.js';
import { Point, Polygon } from 'pixi.js';
export declare const getLength: (p: Point) => number;
/**
 * Returns the distance between two points.
 */
export declare const dist: (p1: Point, p2: Point) => number;
/**
 * Get the point located by travelling along a sequence of points
 * for the given distance.
 * @param {Point[]} points
 * @param {number} dist
 * @returns {Point}
 */
export declare const getTravelPt: (points: Point[], dist: number) => PIXI.Point;
/**
 * Return interpolated point.
 * @param {Point} p0
 * @param {Point} p1
 * @param {number} t
 */
export declare const lerpPt: (p0: Point, p1: Point, t: number) => PIXI.Point;
/**
 * Set p0 to the linear interpolation of p0 and p1.
 * @param {Point} p0
 * @param {Point} p1
 * @param {number} t
 * @returns {Point} returns p0.
 */
export declare const setLerp: (p0: Point, p1: Point, t: number) => void;
/**
 * Return a point falling a given distance between two points.
 * @param {Point} p1
 * @param {Point} p2
 * @param {number} len - length between p2 and p1.
 */
export declare const getMidPt: (p1: Point, p2: Point, len: number) => PIXI.Point;
/**
 *
 * @param {Point[]} points
 * @returns {Point} Center point of all points.
 */
export declare const getCenter: (points: Point[]) => PIXI.Point;
/**
 * sets the values of mat to a reflection across normal axis a,b
 * without altering tx,ty.
 * @returns {Matrix}
 */
export declare const setReflect: (mat: PIXI.Matrix, a: number, b: number) => void;
/**
 * @returns {PIXI.Matrix} - reflection matrix across the normal a,b.
 */
export declare const reflection: (a: number, b: number) => PIXI.Matrix;
/**
 * @returns {PIXI.Point} point normal to p.
 */
export declare const norm: (p: Point) => PIXI.Point;
/**
 * @returns {number} - magnitude of the cross product p1xp2
 * left hand rule; normals point screen upwards.
 */
export declare const cross: (p1: Point, p2: Point) => number;
/**
 * move() is separate from translate() because of how PIXI
 * handles Polygon point storage.
 * @property {PIXI.Polygon} poly - polygon to translate.
 */
export declare const move: (poly: Polygon, tx: number, ty: number) => void;
/**
 * @property {Point[]} points
 */
export declare const translate: (points: Point[], tx: number, ty: number) => void;
/**
 * @property {Point[]} points
 */
export declare const rotate: (points: Point[], theta: number) => void;
