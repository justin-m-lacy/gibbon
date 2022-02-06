import Group from "./group";
import Game from './game';
import GameObject from './gameObject';

export default class System extends Group {

	/**
	 * @property {boolean} enabled
	 */
	get enabled() { return this._enabled; }
	set enabled(v) { this._enabled = v; }

	_enabled: boolean = false;;

	/**
	 *
	 * @param {Game} game
	 * @param {GameObject} clip - system container clip.
	 * @param {boolean} [enabled=false] - whether to start System immediately.
	 */
	constructor(game: Game, clip?: GameObject | null, enabled: boolean = false) {

		super(game, clip, !enabled);

		if (enabled === true) this.start();

	}

	start() {

		if (!this._enabled) {
			this.game.addUpdater(this);
		}
		super.unpause();
		this._enabled = true;

	}

	stop() {

		if (this._enabled === true) {
			this.game.removeUpdater(this);
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
	 * Override in subclass.
	 */
	update() { }

}