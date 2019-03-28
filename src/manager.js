export default class Manager {

	/**
	 * @property {Game} game
	 */
	get game() { return this._game; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this._engine; }

	/**
	 * 
	 * @param {Game} game 
	 */
	constructor( game ){

		this._game = game;
		this._engine = game.engine;

	}

}