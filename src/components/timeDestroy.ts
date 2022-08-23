import Component from "../core/component";

export default class TimeDestroy extends Component {

	/**
	 * @property {number} time - time in milliseconds before destroy/effect.
	 * Setting to new value resets the timer.
	 */
	get timeMs(): number {
		return this._timer;
	}
	set timeMs(v: number) {
		this._timer = v;
	}

	_timer: number;

	constructor() {
		super();
		this._timer = -1;
	}

	update(delta: number) {

		if (this._timer > 0) {

			this._timer -= delta;
			if (this._timer <= 0) {

				this.actor?.destroy();

			}
		}

	}

}