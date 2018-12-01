export default class Manager {

	get game() { return this._game; }
	get engine() { return this._engine; }

	constructor( game ){

		this._game = game;
		this._engine = game.engine;

	}

}