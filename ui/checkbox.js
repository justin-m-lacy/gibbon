import { Container, Sprite, Text, Point, Rectangle } from "pixi.js";
import UiSkin from "./uiSkin";

export default class Checkbox extends Container {

	get checked(){return this._checked;}
	set checked(v) {

		if ( v === this._checked ) return;

		this._checked=v;
		if ( v === true ) {

			if ( this._tween ) {
				this._tween.play();
			} else this.check.visible = true;

			this.emit('checked', this );

		} else {

			if ( this._tween ) {
				this._tween.reverse();
			} else this.check.visible = false;
			this.emit('unchecked', this );

		}
		this.emit('toggled', v );

	}

	/**
	 * {TweenMax|TweenLite} Tween to play to check the checkbox.
	 */
	get tween() { return this._tween; }
	set tween(v) { this._tween = v;}

	get text() { return this._text;}
	set text(v) { this._text = v;}

	constructor( boxTex, checkTex, text='', checked=false ){

		super();

		this.interactive = true;
		this.hitArea = new Rectangle( 0, 0, boxTex.width, boxTex.height );

		this.box = new Sprite( boxTex );
		this.check = new Sprite( checkTex );

		this.check.visible = this._checked = checked;

		this.textClip = UiSkin.Default ? UiSkin.Default.makeSmallText( text ) : new Text(text);

		this.addChild( this.box );
		this.addChild( this.check );
		this.addChild( this.textClip );

		this.centerCheck( this.box, this.check );
		this.textClip.position = new Point(

			this.box.x + this.box.width + 4,
			this.box.y + ( this.box.height - this.textClip.height )/2

		);

		this.on( 'pointerup', (e)=>this.checked = !this._checked );

	}

	toggle() {
		this.checked = !this._checked;
	}

	centerCheck( box, check ) {

		check.position = new Point(
			box.x + ( box.width - check.width)/2,
			box.y + ( box.height - check.height )/2 );

	}

}