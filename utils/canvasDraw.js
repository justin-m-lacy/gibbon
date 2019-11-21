import { htmlStr } from './colorUtils';

export default class CanvasDraw {

	get canvas(){return this._canvas; }

	get width(){return this._width;}
	get height(){return this._height;}

	getTexture(){
		return PIXI.BaseTexture.from( this.draw.canvas );
	}

	constructor( width, height ){


		this._canvas = document.createElement('canvas' );
		this.ctx = this._canvas.getContext('2d');

		this._width = width;
		this._height = height;

		this._canvas.width = width;
		this._canvas.height = height;

	}

	/**
	 * @param {Point} p0
	 * @param {Point} p1
	 * @param {Gradient} gradient
	 */
	gradFill( p0, p1, gradient ){

		var grad = this.ctx.createLinearGradient( p0.x, p0.y, p1.x, p1.y);
		gradient.addStops(grad);

		this.ctx.fillStyle = grad;
		this.ctx.fillRect( 0, 0, this._width, this._height );

	}


	/**
	 *
	 * @param {number} color
	 */
	fill( color ) {

		this.ctx.fillStyle = htmlStr(color);
		this.ctx.fillRect( 0, 0, this.width, this.height );

	}

}