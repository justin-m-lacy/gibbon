import { Component } from "../core/component";

export class TimeDestroy extends Component {

	/**
	 * @property {number} timeMs - time in milliseconds before destroy/effect.
	 * Setting to new value resets the timer.
	 */
	get timeMs(): number {
		return this._timer * 1000;
	}
	set timeMs(v: number) {
		this._timer = v / 1000;
	}

	get time() {
		return this._timer;
	}
	set time(v) {
		this._timer = v;
	}

	private _timer: number = -1;

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