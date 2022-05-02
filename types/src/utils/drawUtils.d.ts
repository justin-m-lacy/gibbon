import { Graphics, Polygon, GraphicsData, Point, DisplayObject, RenderTexture, AbstractRenderer } from 'pixi.js';
export declare const drawToTexture: (d: DisplayObject, renderer?: AbstractRenderer | undefined) => RenderTexture;
/**
 * Create a DisplayObject for a Shape.
 * The shape will be drawn centered within the Graphics object, and the Graphic
 * Object itself placed at the Shape's x,y location.
 * @param {PIXI.Rectangle|PIXI.Circle|PIXI.Polygon|PIXI.Ellipse}
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {?Graphics}
 */
declare function createShape(data: GraphicsData): Graphics | null;
/**
 * Create a new Graphic with a polygon drawn in it.
 * @param {Vector[]} points
 * @param {*} graphicsData
 * @returns {Graphic}
 */
declare function createPoly(points: Polygon | number[] | Point[], graphicsData: GraphicsData): Graphics;
export { createShape, createPoly };
