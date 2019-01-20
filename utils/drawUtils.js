/**
 * Create a DisplayObject for a Shape.
 * @param {PIXI.Rectangle|PIXI.Circle|PIXI.Polygon|PIXI.Ellipse}
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {Graphics|null}
 */
function createShape( shape, graphicsData ) {

	let shape = graphicsData.shape;
	let g = new Graphics();

	if ( graphicsData.fill ) g.beginFill( graphicsData.fillColor||0, graphicsData.fillAlpha||1 );

	g.lineStyle( graphicsData.lineWidth||0, graphicsData.lineColor||0, graphicsData.lineAlpha||1);

	switch ( shape.type ) {

		case PIXI.SHAPES.RECT:
			g.drawRect( shape.x, shape.y, shape.width, shape.height );
			break;
		case PIXI.SHAPES.CIRC:
			g.drawCircle( shape.x, shape.y, shape.radius );
			break;
		case PIXI.SHAPES.POLY:
			g.drawPolygon( shape.points );
			break;
		case PIXI.SHAPES.ELIP:
			g.drawEllipse( shape.x, shape.y, shape.width, shape.height );
			break;
		case PIXI.SHAPES.RREC:
			g.drawRoundedRect( shape.x, shape.y, shape.width, shape.height, shape.radius );
			break;
		default:
			return null;

	}

	if ( graphicsData.fill ) g.endFill();

	return g;

}

export { createShape };

/**
 * Create a DisplayObject for a Shape. PIXI 5.0 version.
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {Graphics|null}
 */
/*function createShape( graphicsData ) {

	let shape = graphicsData.shape;
	let g = new Graphics();

	if ( graphicsData.fill ) g.beginFill( graphicsData.fillColor||0, graphicsData.fillAlpha||1 );

	g.lineStyle( graphicsData.lineWidth||0, graphicsData.lineColor||0, graphicsData.lineAlpha||1);

	switch ( shape.type ) {

		case PIXI.SHAPES.RECT:
			g.drawRect( shape.x, shape.y, shape.width, shape.height );
			break;
		case PIXI.SHAPES.CIRC:
			g.drawCircle( shape.x, shape.y, shape.radius );
			break;
		case PIXI.SHAPES.POLY:
			g.drawPolygon( shape.points );
			break;
		case PIXI.SHAPES.ELIP:
			g.drawEllipse( shape.x, shape.y, shape.width, shape.height );
			break;
		case PIXI.SHAPES.RREC:
			g.drawRoundedRect( shape.x, shape.y, shape.width, shape.height, shape.radius );
			break;
		default:
			return null;

	}

	if ( graphicsData.fill ) g.endFill();

	return g;

}*/