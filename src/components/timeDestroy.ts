import { Component } from "../core/component";

export class TimeDestroy extends Component {

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

	_timer: number = -1;

	constructor() {
		super();
	}

	update(delta: number) {

		if (this._timer >= 0) {

			this._timer -= delta;
			if (this._timer <= 0) {

				this._timer = -1;
				this.actor?.destroy();

			}
		}

	}

}