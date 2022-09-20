import { Group } from "./core/group";
import type { IUpdater } from "./engine";
import type { Container } from 'pixi.js';
import { Game } from "./game";

export class System<T extends Game = Game> extends Group<T> implements IUpdater {

	/**
	 * @property {boolean} enabled
	 */
	get enabled() { return this._enabled; }
	set enabled(v) { this._enabled = v; }

	_enabled: boolean = false;;

	/**
	 *
	 * @param {Game} game
	 * @param {Actor} clip - system container clip.
	 * @param {boolean} [enabled=false] - whether to start System immediately.
	 */
	constructor(clip?: Container, enabled: boolean = false) {
		super(clip, !enabled);
	}

	onAdded() {
		if (this._enabled) {
			this.start();
		}
	}
	onRemoved() {
		if (this._enabled) {
			this.stop();
		}
	}
	start() {

		if (!this._enabled) {
			this.game?.addUpdater(this);
		}
		super.unpause();
		this._enabled = true;

	}

	stop() {

		if (this._enabled === true) {
			this.game?.removeUpdater(this);
		}
		super.pause();
		this._enabled = false;

	}

	pause() {
		this.stop();
	}

	unpause() {
		this.start();
	}

	destroy() {
		this.stop();
		super.destroy();
	}

	/**
	 * Override in subclasses.
	 */
	update(delta: number) { }

}