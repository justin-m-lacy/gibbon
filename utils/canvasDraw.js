import { htmlStr} from './colorUtils';

export default class CanvasDraw {

	get canvas(){return this._canvas; }

	get width(){return this._width;}
	get height(){return this._height;}

	constructor( width, height ){


		this._canvas = document.createElement('canvas' );

		this._width = width;
		this._height = height;

		this._canvas.width = width;
		this._canvas.height = height;

	}

	fill( color ) {

		var ctx = this._canvas.getContext('2d');

		ctx.fillStyle( htmlStr(color) );
		ctx.fillRect( 0, 0, this.width, this.height );

	}

}