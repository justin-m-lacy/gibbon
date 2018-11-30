import { EventEmitter } from "events";

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export default class UISkin extends EventEmitter {

	get defaultFont() { return this._font;}
	set defaultFont(v){this._font = v;}

	/**
	 * {PIXI.TextStyle } Default text style.
	 */
	get textStyle() { return this._style;}
	set textStyle(v) {
		this._style = v;
		this.emit( 'skin-changed', 'textStyle' );
	}

	get largeStlye() { return this._largeStyle; }
	set largeStyle(v) {
		this._largeStyle = v;
		this.emit( 'skin-changed', 'largeStyle' );
	}

	get smallStyle() { return this._smallStyle;}
	set smallStyle(v) {
		this._smallStyle = v;
		this.emit( 'skin-changed', 'smallStyle' );
	}

	get checkMark() { return this._checkMark;}
	set checkMark(v) {
		this._checkMark = v;
		this.emit( 'skin-changed', 'checkMark' );
	}

	get box() { return this._box; }
	set box(v) { this._box = v;
		this.emit( 'skin-changed', 'box' );
	}

	constructor( vars=null ){

		super();
		if ( vars ) Object.assign( this, vars );

	}

}