import { Sprite, Graphics } from "pixi.js";

/**
 * Graphical information for rendering a PIXI DisplayObject.
 */
export default class SkinData {

	get graphicsData() { return this._graphics || null; }
	set graphicsData(v) { this._graphics=v;}

	get lineWidth() { return this._lineWidth; }
	set lineWidth(v) { this._lineWidth =v;}

	get lineColor() { return this._lineColor; }
	set lineColor(v) { this._lineColor=v;}

	get lineAlpha() { return this._lineAlpha; }
	set lineAlpha(v) { this._lineAlpha = v;}

	/**
	 * {boolean}
	 */
	get fill() { return this._fill; }
	set fill(v) { this._fill=v;}

	get fillColor() { return this._fillColor; }
	set fillColor(v) { this._fillColor=v;}

	get fillAlpha(){return this._fillAlpha;}
	set fillAlpha(v) { this._fillAlpha=v;}

	/**
	 * {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon|PIXI.RoundedRect} Optional Shape information.
	 * Not that unlike in PIXI.GraphicsData, this is actually a shape object.
	 */
	get shape(){  return this._shape;}
	set shape(v) { this._shape =v;}

	/**
	 * {number}
	 */
	get radius() { return this._radius; }
	set radius(v) { this._raidus = v; }

	/**
	 * {number}
	 */
	get width() { return this._width; }
	set width(v) {this._width=v;}

	/**
	 * {number}
	 */
	get height() { return this._height; }
	set height(v) { this._height=v; }

	/**
	 * {PIXI.Point[]}
	 */
	get points() { return this._points; }
	set points(v) { this._points=v; }

	/**
	 * {number} A type from PIXI.Shapes
	 */
	get type() { return this._shape ? this._shape.type : this._type; }
	set type(v) { this._type = v;}

	/**
	 * {PIXI.Texture}
	 */
	get texture() { return this._texture;}
	set texture(v) { this._texture=v;}

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