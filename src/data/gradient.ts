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