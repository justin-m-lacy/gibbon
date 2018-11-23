import { Point } from 'pixi.js';
import Component from '../component';
import GameObject from '../gameObject';

export default class Camera extends Component {

	get target() { return this._target; }
	set target(v) {

		if ( v ) {
			this._target = v;
			this.panClip.position.set( this.centerX - v.x, this.centerY - v.y );
		}

	}

	get viewRect() { return this.rect; }
	set viewRect(v) { this.rect = v;}

	get center() { return new Point( this.rect.x + this.centerX, this.rect.y + this.centerY );}

	get left() { return this.rect.left; }
	get right() { return this.rect.right; }
	get top() { return this.rect.top; }
	get bottom() { return this.rect.bottom; }

	constructor() {super();}
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
		return this.rect.contains(p);
	}

	/**
	 * 
	 * @param {Rectangle} r
	 * @returns true if a rectangle falls within the camera view, false otherwise. 
	 */
	rectInView( r ) {
		return r.x < this.rect.right && r.right > this.rect.x && r.y < this.rect.bottom && r.bottom > this.rect.y;
	}

	init(){

		this._target = this.gameObject;
		this.panClip = this.gameObject.clip;

		this.rect = this.game.screen.clone();

		this.centerX = this.rect.width/2;
		this.centerY = this.rect.height/2;

	}

	update( delta ) {

		let targPos = this._target.position;

		let destX = this.centerX - targPos.x;
		let destY = this.centerY - targPos.y;

		let pos = this.panClip.position;
		pos.set(
			pos.x + (destX- pos.x)/4,
			pos.y + (destY- pos.y)/4
		);

		this.rect.x = -pos.x;
		this.rect.y = -pos.y;
	
	}

}