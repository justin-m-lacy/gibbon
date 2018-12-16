import { DisplayObject, Graphics, Text} from "pixi.js";
import * as PIXI from 'pixi.js';
import ProgressBar from "./progressBar";
import Checkbox from "./checkbox";

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export default class UiSkin extends PIXI.utils.EventEmitter {

	static SetDefaultSkin( skin) {
		UiSkin.Default = skin;
	}

	static GetDefaultSkin() {
		return UiSkin.Default;
	}

	/**
	 * {Number} width of scrollbars.
	 */
	get scrollbarWidth() { return this._scrollbarWidth; }
	set scrollbarWidth(v) { this._scrollbarWidth=v;}

	get fontColor() { return this._defaultStyle.fill; }
	set fontColor( v ) {

		this._defaultStyle.fill = v;
		this.emit( 'skin-changed', 'fontColor');
	
	}

	/**
	 * {string} changes font family of the default font.
	 */
	get fontFamily() { return this._fontFamily;}
	set fontFamily(v) {

		this._fontFamily = v;

		if ( this._defaultStyle ) this._defaultStyle.fontFamily = v;
		if ( this._largeStyle ) this._largeStyle.fontFamily = v;
		if ( this._smallStyle ) this._smallStyle.fontFamily = v;

		this.emit( 'skin-changed', 'fontFamily');
	}

	/**
	 * {PIXI.TextStyle } Default text style.
	 */
	get defaultStyle() { return this._defaultStyle;}
	set defaultStyle(v) {
		this._defaultStyle = v;
		this.emit( 'skin-changed', 'defaultStyle' );
	}

	get largeSize() { return this._largeStyle.fontSize;}
	set largeSize(v) {

		this._largeStyle.fontSize = v;
		this.emit( 'skin-changed', 'largeSize' );

	}

	get largeStyle() { return this._largeStyle; }
	set largeStyle(v) {
		this._largeStyle = v;
		this.emit( 'skin-changed', 'largeStyle' );
	}

	get smallSize() { return this._smallStyle.fontSize;}
	set smallSize(v) {

		this._smallStyle.fontSize = v;

		this.emit( 'skin-changed', 'smallSize' );

	}

	get smallStyle() { return this._smallStyle;}
	set smallStyle(v) {

		this._smallStyle = v;
		this.emit( 'skin-changed', 'smallStyle' );
	}

	/**
	 * {Texture}
	 */
	get checkMark() { return this._checkMark;}
	set checkMark(v) {
		this._checkMark = v;
		this.emit( 'skin-changed', 'checkMark' );
	}

	/**
	 * {Texture}
	 */
	get box() { return this._box; }
	set box(v) {
		this._box = v;
		this.emit( 'skin-changed', 'box' );
	}

	constructor( vars=null ){

		super();

		this._scrollbarWidth = 18;

		if ( vars ) Object.assign( this, vars );

		this._largeStyle = this._largeStyle || new PIXI.TextStyle( {fontFamily:this._fontFamily } );
		this._smallStyle = this._smallStyle || new PIXI.TextStyle( {fontFamily:this._fontFamily } );
		this._defaultStyle = this._defaultStyle || new PIXI.TextStyle( {fontFamily:this._fontFamily } );

		this._skinData = {};

	}

	/**
	 * Just creates a sprite with a click listener. Included for completeness.
	 * @param {PIXI.Texture} tex 
	 * @param {Function} onClick - function to call on click.
	 * @param {*} context - context of the event listener.
	 */
	makeIconButton( tex, onClick=null, context=null ) {

		let clip = new PIXI.Sprite( tex );

		clip.interactive = true;

		if ( onClick ) clip.on( 'click', onClick, context );
	
		return clip;

	}

	makeTextButton( str, onClick=null, context=null ) {

		let clip = new PIXI.Container();

		console.assert( this._box, 'Skin box is null' );
		let mesh = new PIXI.mesh.NineSlicePlane( this._box );

		console.assert( this._smallStyle, 'small style null');
		let text = this.makeSmallText(str);

		mesh.width = text.width;

		clip.interactive = true;
		clip.addChild( mesh, text );

		//clip.addChild( text );

		if ( onClick !== null ) {
			clip.on( 'pointerdown', onClick, context );
		}

		return clip;


	}

	makeLargeText( str, clone=false ) {
		if ( clone === true ) return new Text( str, this._largeStyle.clone() );
		return new Text( str, this._largeStyle );
	}

	makeSmallText( str, clone=false ) {
		if ( clone === true ) return new Text( str, this._smallStyle.clone() );
		return new Text( str, this._smallStyle );
	}

	makeText( str='', clone=false ) {
		if ( clone === true ) return new Text( str, this._defaultStyle.clone() );
		return new Text( str, this._defaultStyle );
	}

	makeCheckbox( label, checked=false ) {
		return new Checkbox( this._skinData['box'], this._skinData['check'], label, checked );
	}

	makeProgressBar() {

		let backTex = this._skinData['box'];
		let barTex = this._skinData['bar'];

		console.assert( backTex !=null && barTex != null, 'Missing Skin box or bar: ' + backTex + ' , ' + barTex );

		let p = new ProgressBar(
			new PIXI.mesh.NineSlicePlane( backTex ),
			new PIXI.mesh.NineSlicePlane( barTex )
		);

		return p;

	}

	makePane( width=200, height=200 ) {

		let data = this._skinData['frame'];
		if ( !(data instanceof PIXI.Texture ) ) return null;

		let pane = new PIXI.mesh.NineSlicePlane( data );
		pane.width = width;
		pane.height = height;

		return pane;

	}

	makeNineSlice( key, left=12, top=8, right=12, bottom=8 ) {

		let data = this._skinData[key];
		if ( !(data instanceof PIXI.Texture ) ) return null;

		return new PIXI.mesh.NineSlicePlane( data, left, top, right, bottom );

	}

	/**
	 * Generate a texture from the given Graphics and add it
	 * to the skin under the given key.
	 * @param {string} key 
	 * @param {Graphics} g 
	 */
	addAsTexture( key, g ) {
		return this._skinData[key] = g.generateCanvasTexture();
	}

	/**
	 * Set the skinning data for a given key. The data can be style information,
	 * a texture, or any information relevant to ui display.
	 * A 'skin-changed' event will be fired, notifying listeners of the change.
	 * @param {string} key 
	 * @param {*} obj
	 */
	setSkinData( key, obj ) {

		this._skinData[key] = obj;
		this.emit( 'skin-changed', obj );

	}

	/**
	 * Get the skinning data associated with a key.
	 * @param {string} key 
	 */
	getSkinData( key ) {
		return this._skinData[key];
	}

}