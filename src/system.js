export default class System {

	/**
	 * @property {Game} game
	 */
	get game() { return this._game;}
	set game(v) { this._game = v;}

	/**
	 * @property {boolean} enabled
	 */
	get enabled() { return this._enabled; }
	set enabled(v) { this._enabled =v;}

	/**
	 * 
	 * @param {Game} game 
	 */
	constructor(game){

		this.game = game;


	}

	start(){
		this._enabled = true;
	}
	stop(){
		this._enabled = false;
	}

	update(delta ) {
	}

}