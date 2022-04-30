import * as PIXI from 'pixi.js';
import { Point } from 'pixi.js';
import { Gradient } from '../data/gradient';
export default class CanvasDraw {
    readonly canvas: HTMLCanvasElement;
    readonly width: number;
    readonly height: number;
    getTexture(): PIXI.BaseTexture<PIXI.Resource, PIXI.IAutoDetectOptions>;
    constructor(width: number, height: number);
    /**
     * @param {Point} p0
     * @param {Point} p1
     * @param {Gradient} gradient
     */
    gradFill(p0: Point, p1: PIXI.Point, gradient: Gradient): void;
    /**
     *
     * @param {number} color
     */
    fill(color: number): void;
}
