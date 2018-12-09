import Pane from './pane.js';
import { Container, Graphics } from 'pixi.js';
import Scrollbar from './scrollbar.js';
import Anchors from './uiAnchors';

/**
 * Pane with a scrollbar and scrollable content area.
 * Scrollable content should be added to the content clip.
 */
export default class ScrollPane extends Pane {

	get content() {
		return this._content;
	}

	get mask() { return this._content.mask; }

	get scrollbar() { return this._scrollbar; }

	get width() { return this._width; }
	set width(v) {

		super.width = v;
		if ( this._content ) {
			this._content.mask.width = v;
			this._scrollbar.x = v - this._scrollbar.width - 4;
		}

	}
	get height(){return this._height;}
	set height(v) {

		super.height = v;
		if ( this._content ) {
			this._content.mask.height = v;
			this._scrollbar.height = v;
			console.log('NEW SCROLLHEIGHT: ' + this._scrollbar.height );
		}

	}

	constructor( game, skin, opts=null ) {

		super( game, skin, opts );

		this.width = this.width || 200;
		this.height = this.height || 200;

		this._content = new Container();
		this._content.width = this.width;
		this._content.height = this.height;

		this.addChild( this._content );

		this.makeMask();
		this.makeSb();

	}

	makeMask() {

		let mask = new Graphics();
		mask.beginFill( 0 );
		mask.drawRect( 0, 0, this.width, this.height );
		mask.endFill();
		mask.cacheAsBitmap = true;
		this.addChild( mask );

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

		console.log('sb: ' + sb.width  +',' + sb.height);
		this.addChild( sb );

	}

	/**
	 * Adds a child to the content area.
	 * @param {DisplayObject} clip 
	 */
	addContent( clip ) {
		return this._content.addChild( clip );
	}

	addContentAt( clip, index ) {
		return this._content.addChildAt( clip, index );
	}

	destroy() {

		this.content.mask.destroy( true );
		this.content.destroy(true);
		this._scrollbar.destroy(true);

	}

}