import { htmlStr } from './colorUtils';

import * as PIXI from 'pixi.js';
import { Point } from 'pixi.js';
import { Gradient } from '../data/gradient';

export class CanvasDraw {

	readonly canvas: HTMLCanvasElement;
	readonly width: number;
	readonly height: number;

	getTexture() {

		return PIXI.BaseTexture.from(this.canvas);
	}

	constructor(width: number, height: number) {


		this.canvas = document.createElement('canvas');
		//this.ctx = this._canvas.getContext('2d');

		this.width = width;
		this.height = height;

		this.canvas.width = width;
		this.canvas.height = height;

	}

	/**
	 * @param {Point} p0
	 * @param {Point} p1
	 * @param {Gradient} gradient
	 */
	gradFill(p0: Point, p1: PIXI.Point, gradient: Gradient) {

		var ctx = this.canvas.getContext('2d');

		var grad = ctx!.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
		gradient.addStops(grad);

		ctx!.fillStyle = grad;
		ctx!.fillRect(0, 0, this.width, this.height);

	}


	/**
	 *
	 * @param {number} color
	 */
	fill(color: number) {
		var ctx = this.canvas.getContext('2d');
		ctx!.fillStyle = htmlStr(color);
		ctx!.fillRect(0, 0, this.width, this.height);

	}

}