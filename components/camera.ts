import { Point, DisplayObject, Rectangle } from 'pixi.js';
import Component from '../src/component';

export default class Camera extends Component {

	get target(): DisplayObject | null { return this._target; }
	set target(v: DisplayObject | null) {

		if (v) {
			this._target = v;
			if (this._viewRect != null) {
				this._viewRect.x = v.x - this._halfWidth;
				this._viewRect.y = v.y - this._halfHeight;
			}
			this._panClip?.position.set(this._halfWidth - v.x, this._halfHeight - v.y);
		}

	}

	get minScale(): number { return this._minScale || 1; }
	set minScale(v: number) { this._minScale = v; }

	get maxScale(): number { return this._maxScale || 1; }
	set maxScale(v: number) { this._maxScale = v; }


	get viewScale(): number { return this._viewScale; }
	set viewScale(v: number) {

		this._viewScale = v;
		this._panClip?.scale.set(v, v);

	}

	get x(): number { return -(this._panClip?.x ?? 0); }
	set x(v: number) {
		if (this._viewRect != null) {
			this._viewRect.x = v * this._viewScale;
			if (this._panClip != null) {
				this._panClip.x = -this._viewRect.x;
			}
		}
	}

	get y(): number { return -(this._panClip?.x ?? 0); }
	set y(v: number) {

		if (this._viewRect != null) {
			this._viewRect.y = v * this._viewScale;
			if (this._panClip != null) {
				this._panClip.y = -this._viewRect.x;
			}
		}

	}

	/**
	 * @property {Rectangle} Visible rectangle in the Camera's coordinate system.
	 */
	get viewRect(): Rectangle | null { return this._viewRect; }

	/**
	 * @property {Rectangle} Size of the Canvas.
	 */
	get screen(): Rectangle { return this._screen ?? new Rectangle(); }
	set screen(v: Rectangle) { this._screen = v; }


	get centerX() { return this._viewRect.x + this._halfWidth; }
	get centerY() { return this._viewRect.y + this._halfHeight; }

	get center(): Point {
		return new Point(
			this._viewRect.x + this._halfWidth,
			this._viewRect.y + this._halfHeight);
	}

	get left(): number { return this._viewRect.left; }
	get right(): number { return this._viewRect.right; }
	get top(): number { return this._viewRect.top; }
	get bottom(): number { return this._viewRect.bottom; }

	_screen: Rectangle | null = null;
	_target: DisplayObject | null = null;
	_minScale: number = 0;
	_maxScale: number = 0;
	_viewScale: number = 0;
	_x: number = 0;
	_y: number = 0;
	_viewRect: Rectangle = new Rectangle();
	_panClip: DisplayObject | null = null;

	_halfWidth: number = 0;
	_halfHeight: number = 0;


	constructor() {
		super();
	}

	/**
	 * Determines if an item is completely within the view.
	 * @param {*} it
	 * @returns true if item is completely onscreen, false otherwise.
	 */
	containsItem(it: any) {
		return false;
	}

	/**
	 *
	 * @param {*} it
	 * @returns true if item is within the camera view, false otherwise.
	 */
	itemInView(it: any) {
		return false;
	}

	/**
	 *
	 * @param {PIXI.Point} p
	 */
	ptInView(p: Point) {
		return this._viewRect?.contains(p.x, p.y) ?? false;
	}

	/**
	 *
	 * @param {Rectangle} r
	 * @returns true if a rectangle falls within the camera view, false otherwise.
	 */
	rectInView(r: Rectangle) {
		if (this._viewRect != null) {
			return r.x < this._viewRect.right &&
				r.right > this._viewRect.x &&
				r.y < this._viewRect.bottom &&
				r.bottom > this._viewRect.y;
		}
	}

	/**
	 *
	 * @param {PIXI.Point} global
	 * @param {PIXI.Point} [dest=null]
	 * @returns {PIXI.Point}
	 */
	toCameraPoint(global: Point, dest?: Point) {

		dest = dest || new Point();
		return this._panClip?.toLocal(global, undefined, dest);

	}

	init() {

		this._target = null;
		this._panClip = this.gameObject.clip;

		this._viewScale = 1;

		this._screen = this.game.screen!;
		this._viewRect.copyFrom(this._screen!);

		this._halfWidth = this._screen!.width / 2;
		this._halfHeight = this._screen!.height / 2;

	}

	update(delta: number) {

		if (this._target === null) return;

		let targPos = this._target.position;

		let destX = this._halfWidth - targPos.x;
		let destY = this._halfHeight - targPos.y;

		let pos = this._panClip!.position;
		pos.set(
			pos.x + (destX - pos.x) / 4,
			pos.y + (destY - pos.y) / 4
		);

		//console.log('cam pos: ' + pos.x + ', '+ pos.y );

		this._viewRect.x = -pos.x;
		this._viewRect.y = -pos.y;

	}

}