export default class Gradient {

	/**
	 * @property {number[]} colors
	 */
	get colors() { return this._colors; }
	set colors(v) { this._colors =v;}

	/**
	 * @property {number[]} percents - percent of fill
	 * occupied by each color.
	 */
	get percents(){return this._percents;}
	set percents(v){this._percents=v;}

	constructor( colors, percents ){

		this.colors = colors;
		this.percents = percents;

		if ( this.colors.length !== this.percents.length ) console.warn('invalid gradient');
	}

	/**
	 * Ensure percents add to 1.
	 */
	normalize(){

		let a = this.percents;
		let tot = 0;
		for( let i = a.length-1; i >=0; i--){
			tot += a[i];
		}

		if ( tot === 1 ) return;

		for( let i = a.length-1; i >=0; i--){
			a[i] /= tot;
		}

	}

}