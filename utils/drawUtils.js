import {Graphics} from 'pixi.js';

/**
 * Create a DisplayObject for a Shape.
 * The shape will be drawn centered within the Graphics object, and the Graphic
 * Object itself placed at the Shape's x,y location.
 * @param {PIXI.Rectangle|PIXI.Circle|PIXI.Polygon|PIXI.Ellipse}
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {?Graphics}
 */
function createShape( shape, graphicsData ) {

	let g = new Graphics();

	if ( graphicsData.fill === true ) g.beginFill( graphicsData.fillColor||0, graphicsData.fillAlpha||1 );

	g.lineStyle( graphicsData.lineWidth||0, graphicsData.lineColor||0, graphicsData.lineAlpha||1);

	switch ( shape.type ) {

		case PIXI.SHAPES.RECT:
			g.drawRect( -shape.width/2, -shape.height/2, shape.width, shape.height );
			break;
		case PIXI.SHAPES.CIRC:
			g.drawCircle( 0,0, shape.radius );
			break;
		case PIXI.SHAPES.POLY:
			g.drawPolygon( shape.points );
			break;
		case PIXI.SHAPES.ELIP:
			g.drawEllipse( 0,0, shape.width, shape.height );
			break;
		case PIXI.SHAPES.RREC:
			g.drawRoundedRect( 0,0, shape.width, shape.height, shape.radius );
			break;
		default:
			return null;

	}

	g.x = shape.x;
	g.y = shape.y;
	if ( graphicsData.fill === true ) g.endFill();

	return g;

}

/**
 * Create a new Graphic with a polygon drawn in it.
 * @param {Vector[]} points
 * @param {*} graphicsData
 * @returns {Graphic}
 */
function createPoly( points, graphicsData ) {

	let g = new Graphics();

	if ( graphicsData.fill === true ) g.beginFill( graphicsData.fillColor||0, graphicsData.fillAlpha||1 );
	g.lineStyle( graphicsData.lineWidth||0, graphicsData.lineColor||0, graphicsData.lineAlpha||1);
	g.drawPolygon( points );

	if ( graphicsData.fill === true ) g.endFill();

	return g;

}

export { createShape, createPoly };