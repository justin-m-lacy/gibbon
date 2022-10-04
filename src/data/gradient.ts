import { htmlStr, rgbaStr } from '../utils/color-utils';

export class Gradient {

	colors: number[];

	/**
	 * @property {number[]} stops - percent stops of each color.
	 * first step should start at 0, last should be 1.
	 */
	stops: number[];

	constructor(colors: number[], stops: number[]) {

		this.colors = colors;
		this.stops = stops;

	}

	/**
	 * Create a linear gradient object for the context which may include alpha.
	 */
	toAlphaLinear(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {

		const grad = ctx.createLinearGradient(x0, y0, x1, y1);
		this.addAlphaStops(grad);

		return grad;
	}

	/**
	 * Create a radial gradient object for the context that includes alpha channel.
	 */
	toAlphaRadial(ctx: CanvasRenderingContext2D, r0: number, r1: number, x: number = 0, y: number = 0) {

		const grad = ctx.createRadialGradient(x, y, r0, x, y, r1);
		this.addAlphaStops(grad);

		return grad;
	}

	/**
	 * Create a linear gradient object for the context. alpha is ignored.
	 */
	toLinear(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {

		const grad = ctx.createLinearGradient(x0, y0, x1, y1);
		this.addStops(grad);

		return grad;
	}


	/**
	 * Create a radial gradient object for the context. alpha is ignored.
	 */
	toRadial(ctx: CanvasRenderingContext2D, r0: number, r1: number, x: number = 0, y: number = 0) {

		const grad = ctx.createRadialGradient(x, y, r0, x, y, r1);
		this.addStops(grad);

		return grad;
	}

	/**
	 * Add gradient stops which include an alpha component.
	 */
	addAlphaStops(grad: CanvasGradient) {
		for (let i = 0; i < this.stops.length; i++) {
			grad.addColorStop(this.stops[i], rgbaStr(this.colors[i]));
		}
	}

	/**
	 * Add the Gradient color steps to the CanvasGradient with no alpha.
	 * @param {CanvasGradient} grad
	 */
	addStops(grad: CanvasGradient) {

		for (let i = 0; i < this.stops.length; i++) {

			grad.addColorStop(this.stops[i], htmlStr(this.colors[i]));

		}

	}

	/**
	 * Ensure stops are nondecreasing between 0 and 1.
	 */
	normalize() {

		const a = this.stops;
		let prev = 0;
		for (let i = a.length - 1; i >= 0; i--) {

			const cur = a[i];
			if (cur < prev) {
				a[i] = prev;
			} else if (cur > 1) {
				a[i] = prev = 1;
			} else {
				prev = cur;
			}

		}

	}

}