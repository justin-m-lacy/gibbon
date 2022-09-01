import type { Game } from './game';
import type { Engine } from './engine';


/// Currently unused.
export class Manager {

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