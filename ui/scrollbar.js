import { Container, Sprite, Point } from "pixi.js";
import * as PIXI from 'pixi.js';
import Pane from "./pane";
import UiSkin from "./uiSkin";

export default class Scrollbar extends Pane {

	/**
	 * {DisplayObject}
	 */
	get thumb() { return this._thumb; }
	set thumb(v) { this._thumb = v; }

	/**
	 * {number}
	 */
	get viewHeight() { return this._viewHeight; }
	set viewHeight(v) {
		this._viewHeight = this.height = v;
		this.refresh();
	}

	/**
	 * {number} sets the thumb height. If no value is specified, the thumb
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

		if ( this._target ) {
			this._target.removeListener( 'wheel', this.wheelEvent, this );
		}

		this._target=v;

		if ( v ) {

			if ( v.mask ) {
				this._viewHeight = v.mask.height;
			}
			if ( this._autoSizeThumb === true ) this.setThumbHeight();

			v.on('wheel', this.wheelEvent, this );

		}

	}

	/**
	 * 
	 * @param {Game} game 
	 * @param {UiSkin} skin 
	 * @param {Object} [opts=null] 
	 */
	constructor( game, skin, opts=null ){

		super( game, skin, opts );

		if ( this._autoSizeThumb !== false ) this._autoSizeThumb = true;

		this._viewHeight = this.height = this._viewHeight || this.height || 240;

		this.width = opts.width || skin.scrollbarWidth || 18;

		this.makeThumb();
		this.refresh();

		this.bg.interactive = true;
		this.bg.on( 'pointerdown', this.barClick, this );

		this.interactive = this.interactiveChildren = true;

		this._offsetY = 0;
		this._dragPt = new Point();
		this._dragging = false;

		this.on( 'wheel', this.wheelEvent, this );

	}

	/**
	 * Scroll with mouse wheel.
	 * @param {} evt 
	 */
	wheelEvent( evt ) {

		this.thumb.y += evt.data.deltaY;
		this.scroll();

	}

	/**
	 * Refresh scrollbar and thumb size.
	 */
	refresh() {

		if ( this._autoSizeThumb === true ) this.setThumbHeight();
		if ( this._target) {

			if ( this._target.visible === false || this._target.height <= this._viewHeight ) this.visible = false;
			else {

				this.visible = true;
				if ( this._target.y > 0 ) this._target.y = 0;
				else if ( this._target.y + this._target.height < this._viewHeight ) this._target.y = this._viewHeight - this._target.height;

				this.positionThumb();

			}

		} else this.visible = false;

	}

	/**
	 * Scroll content to the thumb's current location.
	 */
	scroll() {

		// thumb-y.
		let y = this.thumb.y;
		if ( y < 0 ) this.thumb.y = 0;
		else if ( y > (this._viewHeight - this._thumb.height) ) this.thumb.y = this._viewHeight - this._thumb.height;

		if ( !this.target || this._viewHeight === this._thumb.height ) return;

		this._target.y = ( this._thumb.y /( this._viewHeight - this._thumb.height) )*(this._viewHeight - this._target.height );

	}

	/**
	 * Scroll up a page. This moves the target view down.
	 */
	pageUp() {

		let y = this._target.y + this._viewHeight;
		if ( y > 0 ) y = 0;
		this._target.y = y;

		this.positionThumb();

	}

	/**
	 * Scroll down a page. This moves the target view up.
	 */
	pageDown() {

		let y = this._target.y - this._viewHeight;
		if ( y < (-this._target.height + this._viewHeight ) ) y = -this._target.height + this._viewHeight;
		this._target.y = y;

		this.positionThumb();

	}

	/**
	 * Set thumb position to correct location based on target position.
	 */
	positionThumb() {
		this.thumb.y = this._target.y * (this._viewHeight - this._thumb.height) / ( this._viewHeight - this._target.height )
	}

	/**
	 * Bar area not on thumb was clicked.
	 * @param {InteractionEvent} evt 
	 */
	barClick( evt ) {

		evt.data.getLocalPosition( this, this._dragPt );
		if ( this._dragPt.y < this._thumb.y ) {
			this.pageUp();
		} else if ( this._dragPt.y > this._thumb.y + this._thumb.height ) {
			this.pageDown();
		}


	}

	makeThumb() {

		console.assert( this.skin != null, 'scrollbar.js: this.skin: ' + this.skin );
		console.assert( this.skin.box != null, 'scrollbar.js: this.skin.box: ' + this.skin.box);

		let thumb = this._thumb = this.skin.makePane();
		thumb.name = "thumb";

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

		this._thumb.y = this._dragPt.y - this._offsetY;;

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