import { htmlStr } from "../utils/colorUtils";

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
	 * Add the Gradient color steps to the CanvasGradient.
	 * @param {CanvasGradient} grad
	 */
	addStops(grad: CanvasGradient) {

		for (let i = 0; i < this.stops.length; i++) {

			grad.addColorStop(this.stops[i], htmlStr(this.colors[i]));

		}

	}

	/**
	 * Ensure stops range from 0 to 1.
	 */
	normalize() {

		const a = this.stops;
		let tot = 0;
		for (let i = a.length - 1; i >= 0; i--) {
			tot += a[i];
		}

		if (tot === 1) return;
	}

}