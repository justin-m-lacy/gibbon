import { Text } from 'pixi.js';

/**
 * Field for displaying a message and numeric value.
 */
export default class CounterField {

	get text() { return this._text; }
	set text(v) { this._text =v;}

	get value() { return this._value; }
	set value(v) { this._value = v;}

	get style(){  return this.clip.style;}
	set style(v) { this.clip.style = v;}

	get clip() { return this._clip;}
	set clip(v) { this._clip = v;}

	get position(){return this._clip.position;}
	set position(v) { this._clip.position =v;}

	get x() { return this.clip.x;}
	set x(v) { this.clip.x = v;}
	
	get y() { return this.clip.y;}
	set y(v) { this.clip.y = v;}

	constructor( text, startVal=0, styleVars ){

		this.text = text;
		this.value = startVal;

		this.clip = new Text( this.text + ': ' + startVal, styleVars );
	
	}

	update( value ) {

		this.value = value;
		this.clip.text = this.text + ': ' + this.value;

	}

}