import { Container, Sprite, Point } from "pixi.js";
import Pane from "./pane";

export default class Scrollbar extends Pane {

	get thumb() { return this._thumb; }
	set thumb(v) { this._thumb = v; }

	get viewHeight() { return this._viewHeight; }
	set viewHeight(v) { this._viewHeight = v; }

	/**
	 * {Number} sets the thumb height. If no value is specified, the thumb
	 * will change size based on the ratio of viewHeight to totalHeight.
	 */
	get thumbHeight() { return this._thumbHeight; }
	set thumbHeight(v) {

		this._thumb.height = v;
		this._thumbHeight =v;

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
		if ( v.mask ) this._viewHeight = v.mask.height;

	}

	constructor( game, skin, opts ){

		super( game, skin, opts );

		if ( this._autoSizeThumb !== false ) this._autoSizeThumb = true;
		this._viewHeight = this._viewHeight || this.height || 240;

		this.makeThumb();

		this._offsetY = 0;
		this._dragPt = new Point();
		this._dragging = false;

	}

	setParent(clip) {

		super.setParent(clip);

	}

	makeThumb() {

		let thumb = this._thumb = new PIXI.mesh.NineSlicePlane( skin.box );

		if ( this._autoSizeThumb === true ) this._thumbHeight = thumb.height = this.getThumbHeight();

		thumb.x = ( this.width - thumb.width)/2;
		thumb.interactive = true;

		thumb.on('pointerdown', this.startDrag, this );
		thumb.on('pointerup', this.endDrag, this );
		thumb.on('pointerupoutside', this.endDrag, this );

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

		this.dragThumb();

	}

	endDrag(evt) {

		this.thumb.on( 'pointermove', this.onDrag, this );
		this._dragging = false;

		this.dragThumb();

	}

	getThumbHeight() {

		if ( this.target && this.target.height ) return this.height*( this._viewHeight / this.target.height );
		return this.height;

	}

	dragThumb() {

		let maxY = this._viewHeight - this._thumbHeight;

		// thumb-y.
		let y = this._dragPt.y - this._offsetY;
		if ( y < 0 ) y = 0;
		else if ( y > maxY ) y = maxY;
		
		this._thumb.y = y;
		if ( this._target ) this._target.y = (y/max)*(this._viewHeight - this._target.height );

	}

}