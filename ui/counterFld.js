import { Text, ticker } from 'pixi.js';

const MIN_COUNT_DIST = 2;
/**
 * Field for displaying a message and numeric value.
 */
export default class CounterField {

	/**
	 * {string}
	 */
	get text() { return this._text; }
	set text(v) { this._text =v;}

	/**
	 * {number}
	 */
	get value() { return this._value; }
	set value(v) { this._value = v;}

	get style(){  return this.clip.style;}
	set style(v) { this.clip.style = v;}

	/**
	 * {DisplayObject}
	 */
	get clip() { return this._clip;}
	set clip(v) { this._clip = v;}

	/**
	 * {PIXI.Point}
	 */
	get position(){return this._clip.position;}
	set position(v) { this._clip.position =v;}

	/**
	 * {number}
	 */
	get x() { return this.clip.x;}
	set x(v) { this.clip.x = v;}

	/**
	 * {number}
	 */
	get y() { return this.clip.y;}
	set y(v) { this.clip.y = v;}

	/**
	 * {Boolean} If true, the counter will count up or down to its current value.
	 */
	get showCount() { return this._showCount; }
	set showCount(v) { this._showCount = v; }

	/**
	 * 
	 * @param {string} [text=''] 
	 * @param {number} [startVal=0] 
	 * @param {Object} styleVars 
	 */
	constructor( text='', startVal=0, styleVars ){

		this._text = text;
		this._value = startVal;

		this.clip = new Text( this.text + ': ' + startVal, styleVars );
	
		this._animating = false;

	}

	/**
	 * 
	 * @param {number} value 
	 */
	update( value ) {

		if ( this._showCount === true ) {

			this._targetVal = value;

			// already animating.
			if ( this._animating === true ) return;
			else if ( Math.abs( value - this.value ) > MIN_COUNT_DIST ) {
	
				this.startAnimation();
				this.animate(1);
				return;

			}

		}

		this.value = value;
		this.clip.text = this.text + ': ' + this.value;

	}

	animate(delta){

		if ( Math.abs(this._targetVal- this.value ) <= MIN_COUNT_DIST ) {

			this.value = this._targetVal;
			this.endAnimation();

		} else {

			this.value += (this._targetVal - this.value )/10;

		}
		this.clip.text = this.text + ': ' + Math.round(this.value );

	}

	endAnimation() {
		ticker.shared.remove( this.animate, this );
		this._animating = false;
	}

	startAnimation() {
		this._animating = true;
		ticker.shared.add( this.animate, this );
	}

}