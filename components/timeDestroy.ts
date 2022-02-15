import Component from "../src/component";
import { Signal } from 'signals';

export default class TimeDestroy extends Component {

	/**
	 * @property {number} timer - time remaining in sec. before destroy/effect.
	 * @note internal timer is in ms for loop convenience.
	 */
	get remainingSec() { return this._timer / 1000; }
	set remainingSec(v) { this._timer = v * 1000; }

	/**
	 * @property {Signal} onComplete - fires when time complete.
	 */
	get onComplete() { return this._sigDone; }

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
	_sigDone: Signal;

	constructor() {
		super();
		this._timer = -1;
		this._sigDone = new Signal();
	}

	update(delta: number) {

		if (this._timer > 0) {

			this._timer -= delta;
			if (this._timer <= 0) {

				this._sigDone.dispatch(this);
				this.gameObject?.destroy();

			}
		}

	}

	destroy() { this._sigDone.dispose(); }

}