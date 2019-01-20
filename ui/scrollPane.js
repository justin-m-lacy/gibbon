import Pane from './pane.js';
import { Container, Graphics } from 'pixi.js';
import Scrollbar from './scrollbar.js';
import Anchors, { UiSkin } from './ui';

/**
 * Pane with a scrollbar and scrollable content area.
 * Scrollable content should be added to the content clip.
 */
export default class ScrollPane extends Pane {

	/**
	 * {DisplayObject}
	 */
	get content() {
		return this._content;
	}

	/**
	 * {DisplayObject}
	 */
	get mask() { return this._content.mask; }

	/**
	 * {Scrollbar}
	 */
	get scrollbar() { return this._scrollbar; }

	/**
	 * {number}
	 */
	get width() { return this._width; }
	set width(v) {

		super.width = v;
		if ( this._content ) {
			this._content.mask.width = v;
			this._scrollbar.x = v - this._scrollbar.width - 4;
		}

	}

	/**
	 * {number}
	 */
	get height(){return this._height;}
	set height(v) {

		super.height = v;
		if ( this._content ) {
			this._content.mask.height = v;
			this._scrollbar.height = v;
		}

	}

	/**
	 * 
	 * @param {Game} game 
	 * @param {UiSkin} skin 
	 * @param {Object} [opts=null] 
	 */
	constructor( game, skin, opts=null ) {

		super( game, skin, opts );

		this.width = this.width || 200;
		this.height = this.height || 200;

		this._content = new Container();
		this._content.interactive = this._content.interactiveChildren = true;
		this._content.width = this.width;
		this._content.height = this.height;

		super.addChild( this._content );

		this.makeMask();
		this.makeSb();

		// functions defined in constructor so super-classes don't access them
		// before initialization.
		this.addChild = function( clip ) {
	
			this._content.addChild( clip );
			this.emit( 'contentchanged', this );
			this._scrollbar.refresh();
			return clip;
		}

		this.addChildAt = function( clip, index ) {
			this._content.addChildAt( clip, index );
			this.emit( 'contentchanged', this );
			this._scrollbar.refresh();
			return clip;
		}

		this.removeChild = function(child) {
			this._content.removeChild( child );
			this.emit( 'contentchanged', this );
			this._scrollbar.refresh();
			return child;
		}

	}

	/**
	 * Refresh the scrollbar and scroll target.
	 */
	refresh() {
		this._scrollbar.refresh();
	}

	/**
	 * Create the mask to reveal the scroll area.
	 */
	makeMask() {

		let mask = new Graphics();
		mask.beginFill( 0 );
		mask.drawRect( 0, 0, this.width, this.height );
		mask.endFill();
		mask.cacheAsBitmap = true;
		super.addChild( mask );

		this._content.mask = mask;

	}

	makeSb() {

		let sb = new Scrollbar( this.game, this.skin,
		{
			target:this._content
		});

		this._scrollbar = sb;
		sb.x = this.width - sb.width - 2;
		sb.y = 0;

		super.addChild( sb );

	}

	removeContentAt( index ) {
		let clip = this._content.removeChildAt( index);
		this.emit('contentchanged', this);
		this._scrollbar.refresh();
		return clip;
	}

	destroy() {

		this.content.mask.destroy( true );
		this.content.destroy();
		this._scrollbar.destroy();

	}

}