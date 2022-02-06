import System from "../src/system";
import { Rectangle, DisplayObject } from "pixi.js";
import Game from "../src/game";
import { quickSplice } from "../utils/arrayUtils";
import GameObject from '../src/gameObject';

export type ExitFunction = (go: GameObject) => void;

/**
 *
 */
export default class BoundsDestroy extends System {

	/**
	 * @property {Rectangle} bounds - objects in system outside the bounds
	 * will automatically be destroyed unless an onExit() function is specified.
	 * If so, the onExit function will be called instead.
	 */
	get bounds() { return this._bounds; }
	set bounds(v) { this._bounds = v; }

	/**
	 * @property {(GameObject)=>void} onExit - function to call when object
	 * leaves bounds. If a function is specified, the object is not destroyed
	 * automatically, but is removed from group.
	 */
	onExit?: ExitFunction;

	/**
	 *
	 * @param {Game} game
	 * @param {DisplayObject} clip
	 * @param {Rectangle} rect
	 */
	constructor(game: Game, clip?: DisplayObject | null, rect?: Rectangle) {

		super(game, clip)

		this.bounds = rect;

	}

	update() {

		if (!this.bounds) return;

		for (let i = this.objects.length - 1; i >= 0; i--) {

			var o = this.objects[i];
			if (o.destroyed) {
				continue;
			}

			var pos = o.position;
			if (this.bounds.contains(pos.x, pos.y) === false) {

				if (this.onExit) this.onExit(o);
				else {
					o.Destroy();
				}

			}

		}

	}

}