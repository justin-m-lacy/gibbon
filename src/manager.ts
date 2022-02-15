import Game from './game';
import Engine from './engine';
export default class Manager {

	readonly game: Game;
	readonly engine: Engine;

	/**
	 * 
	 * @param {Game} game 
	 */
	constructor(game: Game) {

		this.game = game;
		this.engine = game.engine;

	}

}