import type { Actor } from "../..";
import type { Game } from '../game';
import type { Container } from 'pixi.js';
import { Group } from "./group";

/**
 * Group in which the DisplayObjects of added actors are added
 * as children to the group's Container display object.
 */
export class LayerGroup<T extends Game = Game> extends Group<T> {

	/**
	 *
	 * @param container -actor to assign to group, or container to use as group container.
	 * @param enabled
	 */
	constructor(container: Container, enabled: boolean = true) {

		super(container, enabled);

	}

	/**
	 * Remove Actor from group, but not Game or Engine.
	 * @param {Actor} obj
	 */
	remove(obj: Actor) {

		super.remove(obj);
		if (obj.clip) {
			this.clip!.removeChild(obj.clip);
		}
		obj.group = null;

	}

	/**
	 *
	 * @param {Actor} obj
	 * @returns {Actor} the object.
	 */
	add(obj: Actor): Actor {

		if (obj.clip && (obj.clip != this.clip)) {
			this.clip!.addChild(obj.clip);
		}

		return super.add(obj);
	}

}