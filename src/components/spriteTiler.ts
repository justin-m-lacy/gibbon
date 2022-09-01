import { Component } from "../core/component";
import { DisplayObject, TilingSprite } from 'pixi.js';

export class SpriteTiler extends Component {

	/**
	 * @property {DisplayObject} DisplayObject to follow.
	 */
	get target() { return this._target; }
	set target(v) {
		this._target = v;
		if (v) {
			this.sprite?.tilePosition.set(-v.position.x, -v.position.y);
		}
	}

	_target?: DisplayObject;
	sprite?: TilingSprite;

	/**
	 * 
	 * @param {PIXI.Sprite} tilingSprite 
	 */
	constructor(tilingSprite?: TilingSprite) {

		super();
		this.sprite = tilingSprite;

	}

	init() {

		if (!this.sprite) {
			this.sprite = this.actor!.clip as TilingSprite;
		}

	}

	update(delta: number) {

		if (this._target) {

			const pos = this._target.position;
			this.sprite?.tilePosition.set(-pos.x, -pos.y);
		}

	}

}