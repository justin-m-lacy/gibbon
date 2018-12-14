import { Point } from 'pixi.js';
import Component from '../src/component';
import GameObject from '../src/gameObject';

export default class Camera extends Component {

	get target() { return this._target; }
	set target(v) {

		if ( v ) {
			this._target = v;
			this._viewRect.x = v.x - this._halfWidth;
			this._viewRect.y = v.y  - this._halfHeight;
			this._panClip.position.set( this._halfWidth - v.x, this._halfHeight - v.y );
		}

	}

	get minScale() { return this._minScale || 1; }
	set minScale(v ) { this._minScale = v; }

	get maxScale() {return this._maxScale || 1; }
	set maxScale( v ) { this._maxScale = v; }

	get viewScale() {
		return this._viewScale;
	}
	set viewScale(v) {

		this._viewScale = v;
		this._panClip.scale.set(v,v);

	}

	get x(){return -this._panClip.x; }
	set x(v) {
		this._viewRect.x = v*this._viewScale;
		this._panClip.x = -this._viewRect.x;
	}

	get y(){return -this._panClip.x;}
	set y(v) {

		this._viewRect.y = v*this._viewScale;
		this._panClip.y = -this._viewRect.x;

	}

	/**
	 * {Rectangle} Visible rectangle in the Camera's coordinate system.
	 */
	get viewRect() { return this._viewRect; }

	get screen() { return this._screen; }
	set screen(v) { this._screen = v;}

	get centerX() { return this._viewRect.x + this._halfWidth; }
	get centerY() { return this._viewRect.y + this._halfHeight; }

	get center() { return new Point( this._viewRect.x + this._halfWidth, this._viewRect.y + this._halfHeight );}

	get left() { return this._viewRect.left; }
	get right() { return this._viewRect.right; }
	get top() { return this._viewRect.top; }
	get bottom() { return this._viewRect.bottom; }

	constructor() {

		super();

		window.addEventListener( 'wheel', (evt)=>{
		});

	}

	/**
	 * Determines if an item is completely within the view.
	 * @param {*} it 
	 * @returns true if item is completely onscreen, false otherwise.
	 */
	containsItem(it) {
		return false;
	}

	/**
	 * 
	 * @param {*} it 
	 * @returns true if item is within the camera view, false otherwise.
	 */
	itemInView( it ) {
		return false;
	}

	/**
	 * 
	 * @param {Point} p 
	 */
	ptInView(p) {
		return this._viewRect.contains(p);
	}

	/**
	 * 
	 * @param {Rectangle} r
	 * @returns true if a rectangle falls within the camera view, false otherwise. 
	 */
	rectInView( r ) {
		return r.x < this._viewRect.right && r.right > this._viewRect.x && r.y < this._viewRect.bottom && r.bottom > this._viewRect.y;
	}

	init(){

		this._target = null;
		this._panClip = this.gameObject.clip;

		this._viewScale = 1;

		this._screen = this.game.screen;
		this._viewRect = this._screen.clone();

		this._halfWidth = this._screen.width/2;
		this._halfHeight = this._screen.height/2;

	}

	update( delta ) {

		if ( this._target === null ) return;

		let targPos = this._target.position;

		let destX = this._halfWidth - targPos.x;
		let destY = this._halfHeight - targPos.y;

		let pos = this._panClip.position;
		pos.set(
			pos.x + (destX- pos.x)/4,
			pos.y + (destY- pos.y)/4
		);

		this._viewRect.x = -pos.x;
		this._viewRect.y = -pos.y;
	
	}

}