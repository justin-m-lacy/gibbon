import { Group } from "./core/group";
import type { IUpdater } from "./engine";
import type { Container } from 'pixi.js';
import { Game } from "./game";

export class System<T extends Game = Game> extends Group<T> implements IUpdater {

	/**
	 *
	 * @param {Game} game
	 * @param {Actor} clip - system container clip.
	 * @param {boolean} whether to start System immediately.
	 */
	constructor(clip?: Container, enabled: boolean = true) {
		super(clip, enabled);
	}

	public enable() {

		if (!this.enabled) {
			super.enable();
			this.game?.addUpdater(this);
		}
	}

	public disable() {
		if (this.enabled) {
			super.disable();
			this.game?.removeUpdater(this);
		}
	}

	/**
	 * Override in subclasses.
	 */
	update(delta: number) { }

}