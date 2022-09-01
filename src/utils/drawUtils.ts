import { Circle, Graphics, Rectangle, Polygon, Ellipse, GraphicsData, RoundedRectangle, Point, DisplayObject, RenderTexture, AbstractRenderer } from 'pixi.js';
import * as PIXI from 'pixi.js';

export const drawToTexture = (d: DisplayObject, renderer?: AbstractRenderer) => {

	const bounds = d.getBounds();
	const renderTex: RenderTexture =
		RenderTexture.create({ width: bounds.width, height: bounds.height });

	const useRenderer = renderer ?? PIXI.autoDetectRenderer();
	useRenderer.render(d, { renderTexture: renderTex });

	return renderTex;

}

/**
 * Create a DisplayObject for a Shape.
 * The shape will be drawn centered within the Graphics object, and the Graphic
 * Object itself placed at the Shape's x,y location.
 * @param {PIXI.Rectangle|PIXI.Circle|PIXI.Polygon|PIXI.Ellipse}
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {?Graphics}
 */
export const createShape = (data: GraphicsData) => {

	const g = new Graphics();

	g.beginFill(
		data.fillStyle.color,
		data.fillStyle.alpha);


	g.lineStyle(
		data.lineStyle.width,
		data.lineStyle.color,
		data.lineStyle.alignment);

	const shape = data.shape;
	//g.drawShape(data.shape);

	switch (data.type) {

		case PIXI.SHAPES.RECT:
			const rect = shape as Rectangle;
			g.drawRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
			break;
		case PIXI.SHAPES.CIRC:
			g.drawCircle(0, 0, (shape as Circle).radius);
			break;
		case PIXI.SHAPES.POLY:
			g.drawPolygon((shape as Polygon).points);
			break;
		case PIXI.SHAPES.ELIP:
			g.drawEllipse(0, 0, (shape as Ellipse).width, (shape as Ellipse).height);
			break;
		case PIXI.SHAPES.RREC:
			const rrect = shape as RoundedRectangle;
			g.drawRoundedRect(0, 0, rrect.width, rrect.height, rrect.radius);
			break;
		default:
			return null;

	}

	if ('x' in shape && 'y' in shape) {
		g.x = shape.x;
		g.y = shape.y;
	}

	g.endFill();

	return g;

}

/**
 * Create a new Graphic with a polygon drawn in it.
 * @param {Vector[]} points
 * @param {*} graphicsData
 * @returns {Graphic}
 */
export const createPoly = (points: Polygon | number[] | Point[], graphicsData: GraphicsData) => {

	const g = new Graphics();

	g.beginFill(graphicsData.fillStyle.color, graphicsData.fillStyle.alpha);
	g.lineStyle(graphicsData.lineStyle.width, graphicsData.lineStyle.color, graphicsData.lineStyle.alpha);
	g.drawPolygon(points);

	g.endFill();

	return g;

}