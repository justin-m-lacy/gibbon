import { Rectangle, Container } from "pixi.js";
import { System } from "../system";
import { Actor } from '../core/actor';

export type ExitFunction = (go: Actor) => void;

/**
 *
 */
export class BoundsDestroy extends System {

	/**
	 * @property {(Actor)=>void} onExit - function to call when object
	 * leaves bounds. If a function is specified, the object is not destroyed
	 * automatically, but is removed from group.
	 */
	onExit?: ExitFunction;

	/**
	 * @property {Rectangle} bounds - objects in system outside the bounds
	 * will automatically be destroyed unless an onExit() function is specified.
	 * If so, the onExit function will be called instead.
	 */
	readonly bounds: Rectangle;

	/**
	 *
	 * @param {Game} game
	 * @param {Container} clip
	 * @param {Rectangle} rect
	 */
	constructor(rect: Rectangle, clip?: Container) {

		super(clip)

		this.bounds = rect;

	}

	update() {

		for (let i = this.objects.length - 1; i >= 0; i--) {

			const o = this.objects[i];
			if (o.isDestroyed) {
				continue;
			}

			const pos = o.position;
			if (this.bounds.contains(pos.x, pos.y) === false) {

				if (this.onExit) this.onExit(o);
				else {
					o.destroy();
				}

			}

		}

	}

}