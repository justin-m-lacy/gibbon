import { Sprite, Graphics, Texture, Circle, Rectangle, Ellipse, Polygon, RoundedRectangle, DisplayObject, Point, GraphicsData, SHAPES } from 'pixi.js';

type Shape = Circle | Rectangle | Ellipse | Polygon | RoundedRectangle;

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
	lineWidth: number = 1;

	/**
	 * @property {number} lineColor
	 */
	lineColor: number = 0;

	/**
	 * @property {number} lineAlpha
	 */
	lineAlpha: number = 1;

	/**
	 * @property {boolean} fill
	 */
	fill: boolean = false;

	/**
	 * @property {number} fillColor
	 */
	fillColor: number = 0;

	/**
	 * @property {number} fillAlpha
	 */
	fillAlpha: number = 1;

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
	get type(): number { return this.shape?.type ?? this._type ?? 0; }
	set type(v: number) { this._type = v; }

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
	constructor(opts?: Partial<SkinData>) {

		if (opts) {
			this.graphicsData = opts.graphicsData;
			this.lineAlpha = opts.lineAlpha ?? 1;
			this.lineColor = opts.lineColor ?? 0;
			this.lineWidth = opts.lineWidth ?? 1;
			this.fill = opts.fill ?? false;

		}

	}

	/**
	 * Create a DisplayObject based on the skin data.
	 * @returns {DisplayObject}
	 */
	createDisplay(): DisplayObject | null {

		if (this.texture) return new Sprite(this.texture);

		let g = new Graphics();

		if (this.fill) g.beginFill(this.fillColor, this.fillAlpha);

		g.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);

		if (this.shape != null) {
			g.drawShape(this.shape);
		}

		if (this.fill) g.endFill();

		return g;

	}

}