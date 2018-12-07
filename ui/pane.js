import { Container } from "pixi.js";

export default class Pane extends Container {

	/**
	 * {TweenMax} Tween to hide or show the pane.
	 */
	get tween() { return this._tween; }
	set tween(v) { this._tween = v; }

	get padding() { return this._padding; }
	set padding(v) { this._padding = v;}

	get width() { return this._bg.width; }
	set width(v) { this._bg.width = v; }

	get height() { return this._bg.height; }
	set height(v) { this._bg.height = v; }

	get bg() { return this._bg; }
	set bg(v) { this._bg = v; }

	constructor( game, skin, opts=null ) {

		super();

		this.game = game;
		this.skin = skin;

		this._bg = skin.makePane();

		// placing these variables here allows opts to override.
		this.interactive = true;
		this.interactiveChildren = true;
		this.visible = false;
		this._padding = 12;

		if ( opts ) {

			Object.assign( this, opts );

			this._bg.width = this.width;
			this._bg.height = this.height;

		}

		this.addChild( this._bg );
		//this.on( 'pointerup', (e)=>e.stopPropagation() );
		this.on( 'pointerdown', (e)=>e.stopPropagation() );

		this._showing = false;
	
	}

	resize() {
	}

	onHide() {
		this.visible = false;
	}

	toggle() {

		if ( this._tween ) {

			if ( this._showing === true || this.visible === true ) {
				this._showing = false;
				this._tween.reverse();
			} else {
				this._tween.play();
	
			}

		} else this.visible = !this.visible;

	}

	show() {
		this._showing = true;
		this.interactive = true;
		this.visible = true;

	}

	hide(){
		this._showing = false;
		this.visible = false;
	}

}