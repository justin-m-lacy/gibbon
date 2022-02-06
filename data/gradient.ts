import { htmlStr } from "../utils/colorUtils";

export class Gradient {

	/**
	 * @property {number[]} colors
	 */
	get colors() { return this._colors; }
	set colors(v) { this._colors =v;}

	/**
	 * @property {number[]} stops - percent stops of each color.
	 * first step should start at 0, last should be 1.
	 */
	get stops(){return this._stops;}
	set stops(v){this._stops=v;}

	constructor( colors, stops ){

		this.colors = colors;
		this.stops = stops;

	}

	/**
	 * Add the Gradient color steps to the CanvasGradient.
	 * @param {CanvasGradient} grad
	 */
	addStops( grad ) {

		for( let i = 0; i < this._stops.length; i++ ){

			grad.addColorStop( this._stops[i], htmlStr(this._colors[i]) );

		}

	}

	/**
	 * Ensure steps range from 0 to 1.
	 */
	normalize(){

		let a = this.steps;
		let tot = 0;
		for( let i = a.length-1; i >=0; i--){
			tot += a[i];
		}

		if ( tot === 1 ) return;
	}

}