import Component from "../src/component";
import Signal from 'signals';

export default class TimeDestroy extends Component {

	/**
	 * @property {number} timer - time remaining in sec. before destroy/effect.
	 * @note internal timer is in ms for loop convenience.
	 */
	get timer() { return this._timer/1000; }
	set timer(v) { this._timer = v*1000;}

	/**
	 * @property {Signal} onComplete - fires when time complete.
	 */
	get onComplete(){return this._sigDone; }

	/**
	 * @property {number} time - time in seconds before destroy/effect.
	 * Setting to new value resets the timer.
	 */
	get time(){
		return this._time;
	}
	set time(v) {
		this._time = v;
		this.timer = v;
	}


	constructor(){
		super();
		this._timer = -1;
		this._sigDone = new Signal();
	}

	init(){
		this.ticker = this.game.ticker;
	}

	update(){

		if ( this._timer < 0 ) return;

		this._timer -= this.ticker.deltaMS;
		if ( this._timer <= 0 ) {

			this._sigDone.dispatch( this );
			this.gameObject.Destroy();

		}

	}

	destroy(){

		this._sigDone.removeAll();
		this._sigDone = null;

	}

}