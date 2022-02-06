import Component from "../src/component";
import { DisplayObject, Sprite } from 'pixi.js';

export default class SpriteTiler extends Component {

	/**
	 * @property {DisplayObject} DisplayObject to follow.
	 */
	get target(): DisplayObject { return this._target; }
	set target(v) {
		this._target = v;
		if (v) this.sprite.tilePosition.set(-v.position.x, -v.position.y);
	}

	sprite?: Sprite;

	/**
	 * 
	 * @param {PIXI.Sprite} tilingSprite 
	 */
	constructor(tilingSprite?: Sprite) {

		super();
		this.sprite = tilingSprite;

	}

	init() {

		if (!this.sprite) {
			this.sprite = this.gameObject.clip;
		}

	}

	update(delta: number) {

		if (!this._target) return;
		let pos = this._target.position;

		this.sprite.tilePosition.set(-pos.x, -pos.y);

	}

}