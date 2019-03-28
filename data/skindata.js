import { Sprite, Graphics } from "pixi.js";

/**
 * Graphical information for rendering a PIXI DisplayObject.
 */
export default class SkinData {

	/**
	 * @property {} graphicsData
	 */
	get graphicsData() { return this._graphics || null; }
	set graphicsData(v) { this._graphics=v;}

	/**
	 * @property {number} lineWidth
	 */
	get lineWidth() { return this._lineWidth; }
	set lineWidth(v) { this._lineWidth =v;}

	/**
	 * @property {number} lineColor
	 */
	get lineColor() { return this._lineColor; }
	set lineColor(v) { this._lineColor=v;}

	/**
	 * @property {number} lineAlpha
	 */
	get lineAlpha() { return this._lineAlpha; }
	set lineAlpha(v) { this._lineAlpha = v;}

	/**
	 * @property {boolean} fill
	 */
	get fill() { return this._fill; }
	set fill(v) { this._fill=v;}

	/**
	 * @property {number} fillColor
	 */
	get fillColor() { return this._fillColor; }
	set fillColor(v) { this._fillColor=v;}

	/**
	 * @property {number} fillAlpha
	 */
	get fillAlpha(){return this._fillAlpha;}
	set fillAlpha(v) { this._fillAlpha=v;}

	/**
	 * @property {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon|PIXI.RoundedRect} shape - Optional Shape information.
	 * Not that unlike in PIXI.GraphicsData, this is actually a shape object.
	 */
	get shape(){  return this._shape;}
	set shape(v) { this._shape =v;}

	/**
	 * @property {number}
	 */
	get radius() { return this._radius; }
	set radius(v) { this._raidus = v; }

	/**
	 * @property {number} width
	 */
	get width() { return this._width; }
	set width(v) {this._width=v;}

	/**
	 * @property {number} height
	 */
	get height() { return this._height; }
	set height(v) { this._height=v; }

	/**
	 * @property {PIXI.Point[]} points
	 */
	get points() { return this._points; }
	set points(v) { this._points=v; }

	/**
	 * @property {number} type - A type from PIXI.Shapes
	 */
	get type() { return this._shape ? this._shape.type : this._type; }
	set type(v) { this._type = v;}

	/**
	 * @property {PIXI.Texture} texture
	 */
	get texture() { return this._texture;}
	set texture(v) { this._texture=v;}

	/**
	 * 
	 * @param {Object} [opts=null] 
	 */
	constructor( opts=null ) {

		if ( opts ) Object.apply( this, opts );

	}

	/**
	 * Create a DisplayObject based on the skin data.
	 * @returns {DisplayObject}
	 */
	create() {
	
		if ( this._texture ) return new Sprite( this._texture );

		let g = new Graphics();

		if ( this._fill ) g.beginFill( this._fillColor||0, this._fillAlpha||1 );

		g.lineStyle( this._lineWidth||0, this._lineColor||0, this._lineAlpha||1);
	
		switch ( this._shape ) {
	
			case PIXI.SHAPES.RECT:
				g.drawRect( this._shape.x, this._shape.y, this._shape.width, this._shape.height );
				break;
			case PIXI.SHAPES.CIRC:
				g.drawCircle( this._shape.x, this._shape.y, this._shape.radius );
				break;
			case PIXI.SHAPES.POLY:
				g.drawPolygon( this._shape.points );
				break;
			case PIXI.SHAPES.ELIP:
				g.drawEllipse( this._shape.x, this._shape.y, this._shape.width, this._shape.height );
				break;
			case PIXI.SHAPES.RREC:
				g.drawRoundedRect( this._shape.x, this._shape.y, this._shape.width, this._shape.height, this._shape.radius );
				break;
			default:
				return null;

		}

		if ( this._fill ) g.endFill();

		return g;

	}

}