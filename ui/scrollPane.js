import Pane from './pane.js';
import { Container, Graphics } from 'pixi.js';
import Scrollbar from './scrollbar.js';
import Anchors from './uiAnchors';

/**
 * Pane with a scrollbar and scrollable content area.
 * Scrollable content should be added to the content clip.
 */
export default class ScrollPane extends Pane {

	get content() { return this._content; }
	get mask() { return this._content.mask; }

	get scrollbar() { return this._scrollbar; }

	set width(v) {
		super.width = v;
		this.content.mask.width = v;
	}
	set height(v) {

		super.height = v;
		this.content.mask.height = v;

	}

	constructor( game, skin, opts=null ) {

		super( game, skin, opts );

		this._content = new Container();
		this.addChild( this._content );

		this.makeMask();
		this.makeSb();

	}

	makeMask() {

		let mask = new Graphics();
		mask.beginFill( 0 );
		mask.drawRect( 0, 0, this.height, this.width );
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
		sb.x = this.width - sb.width;

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