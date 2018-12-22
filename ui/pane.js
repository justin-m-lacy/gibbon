import { Container, DisplayObject } from "pixi.js";

export default class Pane extends Container {

	/**
	 * {TweenMax} Tween to hide or show the pane.
	 */
	get tween() { return this._tween; }
	set tween(v) { this._tween = v; }

	get padding() { return this._padding; }
	set padding(v) { this._padding = v;}

	get width() { return this._width;}
	set width(v) { this._width = v;
		if ( this._bg ) this._bg.width = v; }

	get height() { return this._height; }
	set height(v) {
		this._height = v;
		if ( this._bg ) this._bg.height = v;
	}

	get bg() { return this._bg; }
	set bg(v) { this._bg = v; }

	get layout() { return this._layout; }
	set layout(v) {
		this._layout = v;
		if ( v ) v.arrange( this );
	}
	constructor( game, skin, opts=null ) {

		super();

		this.game = game;
		this.skin = skin;

		// placing these variables here allows opts to override.
		this.interactive = this.interactiveChildren = true;
		this._visible = true;
		this._padding = 12;

		if ( opts ) {

			Object.assign( this, opts );

		}

		this._width = this._width || 200;
		this._height = this._height || 200;

		if ( this.bg !== false && skin ) {
			this._bg = skin.makePane( this._width, this._height );
			this.addChild( this._bg );
		}

		//this.on( 'pointerup', (e)=>e.stopPropagation() );
		this.on( 'pointerdown', (e)=>e.stopPropagation() );

		this._showing = false;
	
	}

	arrange() {
		if ( this._layout ) this._layout.arrange(this);
	}

	toggle() {

		if ( this._tween ) {

			if ( this._showing === true ) {
				this._tween.reverse();
			} else {
				this._tween.play();
			}
			this._showing = !this._showing;

		} else this.visible = !this.visible;

	}

	/**
	 * Ensure the clip is padded from the pane edge's by
	 * the padding amount.
	 * @param {DisplayObject} clip 
	 */
	pad( clip ) {

		if ( clip.x < this._padding ) clip.x = this._padding;
		else if ( clip.x+clip.width > this._width ) clip.x = this._width - clip.width - this._padding;

		if ( clip.y < this._padding ) clip.y = this._padding;
		else if ( clip.y+clip.height > this._height ) clip.y = this._height - clip.height - this._padding;

	}

	/**
	 * Center a clip in the view.
	 * @param {DisplayObject} clip 
	 */
	center( clip ) {

		clip.x = 0.5*(this._width - clip.width );
		clip.y = 0.5*(this._height - clip.height );

	}

	show() {
		this._showing = true;
		this.interactive = true;
		this.visible = true;

	}

	hide(){
		this._showing = false;
		this.interactive = false;
		this.visible = false;
	}

}