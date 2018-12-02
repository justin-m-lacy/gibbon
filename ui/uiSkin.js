import { EventEmitter } from "events";
import { DisplayObject, Graphics } from "pixi.js";
import * as PIXI from 'pixi.js';
import ProgressBar from "./progressBar";
import Checkbox from "./checkbox";

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export default class UiSkin extends EventEmitter {

	static SetDefaultSkin( skin) {
		UiSkin.Default = skin;
	}

	static GetDefaultSkin() {
		return UiSkin.Default;
	}

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

	get box() {
		return this._box;
	}
	set box(v) {
		this._box = v;
		this.emit( 'skin-changed', 'box' );
	}

	constructor( vars=null ){

		super();

		if ( vars ) Object.assign( this, vars );

		this._skinData = {};

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

	makePane( width=100, height=200 ) {

		let data = this._skinData['frame'];
		if ( !(data instanceof PIXI.Texture ) ) return null;

		return new PIXI.mesh.NineSlicePlane( data );

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