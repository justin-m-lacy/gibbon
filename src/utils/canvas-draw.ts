import { htmlStr } from './color-utils';

import { BaseTexture, Sprite } from 'pixi.js';
import { Gradient } from '../data/gradient';
import { TPoint } from '@/data/geom';

export class CanvasDraw {

	public readonly canvas: HTMLCanvasElement;
	public readonly width: number;
	public readonly height: number;

	/**
	 * 
	 * @returns New Texture from Canvas content.
	 */
	public getTexture() {

		return BaseTexture.from(this.canvas);
	}

	public getContext() { return this.canvas.getContext('2d'); }

	constructor(width: number, height: number) {


		this.canvas = document.createElement('canvas');

		this.width = width;
		this.height = height;

		this.canvas.width = width;
		this.canvas.height = height;

	}

	/**
	 * Create sprite from current image.
	 * @returns 
	 */
	public toSprite() { return Sprite.from(this.canvas); }

	/**
	 * Create radial gradient. x,y will default to canvas center.
	 * @param x 
	 * @param y 
	 */
	public gradRadial(gradient: Gradient, r0: number, r1: number, x?: number, y?: number) {

		const ctx = this.canvas.getContext('2d')!;

		x = x === undefined ? this.width / 2 : x;
		y = y === undefined ? this.height / 2 : y;

		const grad = ctx.createRadialGradient(x, y, r0, x, y, r1)
		gradient.addStops(grad);

		ctx.fillStyle = grad;
		const r = Math.max(r0, r1);

		ctx.beginPath();
		ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();


	}

	/**
	 * @param {Point} p0
	 * @param {Point} p1
	 * @param {Gradient} gradient
	 */
	public gradFill(p0: TPoint, p1: TPoint, gradient: Gradient) {

		const ctx = this.canvas.getContext('2d')!;

		const grad = ctx!.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
		gradient.addStops(grad);

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, this.width, this.height);

	}


	/**
	 *
	 * @param {number} color
	 */
	public fill(color: number) {
		const ctx = this.canvas.getContext('2d');
		ctx!.fillStyle = htmlStr(color);
		ctx!.fillRect(0, 0, this.width, this.height);

	}

	public clear() {
		const ctx = this.canvas.getContext('2d');
		ctx?.clearRect(0, 0, this.width, this.height);
	}

}