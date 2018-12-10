import { Container, Sprite, Point } from "pixi.js";
import * as PIXI from 'pixi.js';
import Pane from "./pane";

export default class Scrollbar extends Pane {

	get thumb() { return this._thumb; }
	set thumb(v) { this._thumb = v; }

	get viewHeight() { return this._viewHeight; }
	set viewHeight(v) {
		this._viewHeight = this.height = v;
		this.refresh();
	}

	/**
	 * {Number} sets the thumb height. If no value is specified, the thumb
	 * will change size based on the ratio of viewHeight to totalHeight.
	 */
	get thumbHeight() { return this._thumb.height; }
	set thumbHeight(v) {

		this._thumb.height = v;

	}

	/**
	 * {Boolean} [autoSizeThumb] - true if thumb should resize to match
	 * the scrollable area. true by default.
	 */
	get autoSizeThumb() { return this._autoSizeThumb; }
	set autoSizeThumb(v) { this._autoSizeThumb=v;}

	/**
	 * {DisplayObject} clip being scrolled.
	 */
	get target() { return this._target; }
	set target(v) {

		this._target=v;
		if ( v.mask ) {
			this._viewHeight = v.mask.height;
		}
		if ( this._autoSizeThumb === true ) this.setThumbHeight();

	}

	constructor( game, skin, opts=null ){

		super( game, skin, opts );

		if ( this._autoSizeThumb !== false ) this._autoSizeThumb = true;

		this._viewHeight = this.height = this._viewHeight || this.height || 240;

		this.width = opts.width || skin.scrollbarWidth || 18;

		this.makeThumb();
		this.refresh();

		this.interactive = this.interactiveChildren = true;

		this._offsetY = 0;
		this._dragPt = new Point();
		this._dragging = false;

	}

	/**
	 * Refresh scrollbar and thumb size.
	 */
	refresh() {

		if ( this._autoSizeThumb === true ) this.setThumbHeight();

	}

	/**
	 * Scroll content to the thumb's current location.
	 */
	scroll() {

		if ( !this.target || this._viewHeight === this._thumb.height ) return;

		this._target.y = ( this._thumb.y /( this._viewHeight - this._thumb.height) )*(this._viewHeight - this._target.height );

	}

	makeThumb() {

		console.assert( this.skin != null, 'scrollbar.js: this.skin: ' + this.skin );
		console.assert( this.skin.box != null, 'scrollbar.js: this.skin.box: ' + this.skin.box);

		let thumb = this._thumb = new PIXI.mesh.NineSlicePlane( this.skin.box );

		thumb.width = this.width;
		thumb.tint = 0xff0000;

		thumb.x = ( this.width - thumb.width)/2;
	
		thumb.on('pointerdown', this.startDrag, this );
		thumb.on('pointerup', this.endDrag, this );
		thumb.on('pointerupoutside', this.endDrag, this );

		this.addChild( thumb );

		thumb.interactive = true;

		return thumb;

	}

	startDrag(evt) {

		this._dragging = true;
		evt.data.getLocalPosition( this, this._dragPt );
		this._offsetY = this._dragPt.y - this._thumb.y;

		this.thumb.on( 'pointermove', this.onDrag, this );

	}

	onDrag(evt) {

		if ( this._dragging !== true ) return;

		evt.data.getLocalPosition( this, this._dragPt );

		// thumb-y.
		let y = this._dragPt.y - this._offsetY;
		if ( y < 0 ) y = 0;
		else if ( y > (this._viewHeight - this._thumb.height) ) y = this._viewHeight - this._thumb.height;

		this._thumb.y = y;

		this.scroll();

	}

	endDrag(evt) {

		this.thumb.on( 'pointermove', this.onDrag, this );
		this._dragging = false;
	}

	setThumbHeight() {

		if ( this.target && this.target.height ) this._thumb.height = this.height*( this._viewHeight / this.target.height );
		else this._thumb.height = this.height;

	}

}