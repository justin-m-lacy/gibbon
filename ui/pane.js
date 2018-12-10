import { Container } from "pixi.js";

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

		this._bg = skin.makePane( this._width, this._height );

		this.addChild( this._bg );
		//this.on( 'pointerup', (e)=>e.stopPropagation() );
		this.on( 'pointerdown', (e)=>e.stopPropagation() );

		this._showing = false;
	
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