import { Circle, Graphics, Rectangle, Polygon, Ellipse, GraphicsData, RoundedRectangle, Point, DisplayObject, RenderTexture, AbstractRenderer, Container, SHAPES, autoDetectRenderer } from 'pixi.js';

export const drawToTexture = (d: DisplayObject, renderer?: AbstractRenderer) => {

	const bounds = d.getBounds();
	const renderTex: RenderTexture =
		RenderTexture.create({ width: bounds.width, height: bounds.height });

	const useRenderer = renderer ?? autoDetectRenderer();
	useRenderer.render(d, { renderTexture: renderTex });

	return renderTex;

}

/**
 * Create a DisplayObject for a Shape.
 * The shape will be drawn centered within the Graphics object, and the Graphic
 * Object itself placed at the Shape's x,y location.
 * @param data - Shape and drawing data.
 * @param container - Container to add created graphic to.
 * @returns {PIXI.GraphicsData|Object} graphicsData - information on how to draw the shape.
 * @returns {?Graphics}
 */
export const createShape = (data: GraphicsData, container?: Container) => {

	const g = new Graphics();

	if (data.fillStyle) {
		g.beginFill(data.fillStyle.color,
			data.fillStyle.alpha);
	}
	if (data.lineStyle) {
		g.lineStyle(
			data.lineStyle.width,
			data.lineStyle.color,
			data.lineStyle.alignment);

	}
	const shape = data.shape;

	switch (data.type) {

		case SHAPES.RECT:
			const rect = shape as Rectangle;
			g.drawRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
			break;
		case SHAPES.CIRC:
			g.drawCircle(0, 0, (shape as Circle).radius);
			break;
		case SHAPES.POLY:
			g.drawPolygon((shape as Polygon).points);
			break;
		case SHAPES.ELIP:
			g.drawEllipse(0, 0, (shape as Ellipse).width, (shape as Ellipse).height);
			break;
		case SHAPES.RREC:
			const rrect = shape as RoundedRectangle;
			g.drawRoundedRect(0, 0, rrect.width, rrect.height, rrect.radius);
			break;
		default:
			return null;

	}

	if ('x' in shape) {
		g.x = shape.x;
		g.y = shape.y;
	}

	if (data.fillStyle) {
		g.endFill();
	}

	if (container) {
		container.addChild(g)
	}

	return g;

}

/**
 * Draw a dot. Can be useful for debugging.
 * @param x 
 * @param y 
 * @returns 
 */
export const makeDot = (x: number, y: number, container?: Container) => {
	const g = new Graphics();
	g.beginFill(0x550000, 1);
	g.drawCircle(0, 0, 8);
	g.endFill();
	g.position.set(x, y);

	container?.addChild(g);
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