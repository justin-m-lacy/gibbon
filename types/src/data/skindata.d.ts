import { Texture, Circle, Rectangle, Ellipse, Polygon, RoundedRectangle, DisplayObject, Point, GraphicsData } from 'pixi.js';
declare type Shape = Circle | Rectangle | Ellipse | Polygon | RoundedRectangle;
/**
 * Graphical information for rendering a PIXI DisplayObject.
 */
export default class SkinData {
    /**
     * @property {} graphicsData
     */
    graphicsData?: GraphicsData;
    /**
     * @property {number} lineWidth
     */
    lineWidth: number;
    /**
     * @property {number} lineColor
     */
    lineColor: number;
    /**
     * @property {number} lineAlpha
     */
    lineAlpha: number;
    /**
     * @property {boolean} fill
     */
    fill: boolean;
    /**
     * @property {number} fillColor
     */
    fillColor: number;
    /**
     * @property {number} fillAlpha
     */
    fillAlpha: number;
    /**
     * @property {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon|PIXI.RoundedRect} shape - Optional Shape information.
     * Not that unlike in PIXI.GraphicsData, this is actually a shape object.
     */
    shape?: Shape;
    /**
     * @property {number}
     */
    radius?: number;
    /**
     * @property {number} width
     */
    width?: number;
    /**
     * @property {number} height
     */
    height?: number;
    /**
     * @property {number} type - A type from PIXI.Shapes
     */
    get type(): number;
    set type(v: number);
    /**
      * @property {PIXI.Point[]} points
      */
    points?: Point[];
    /**
     * @property {PIXI.Texture} texture
     */
    texture?: Texture;
    _type?: number;
    /**
     *
     * @param {Object} [opts=null]
     */
    constructor(opts?: Partial<SkinData>);
    /**
     * Create a DisplayObject based on the skin data.
     * @returns {DisplayObject}
     */
    createDisplay(): DisplayObject | null;
}
export {};
