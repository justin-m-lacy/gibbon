import Game from './game';
import GameObject from './game-object';
import * as PIXI from 'pixi.js';

/// Function to create instances of game objects.
export type CreateFunction = (...params: any[]) => GameObject;


/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {

	/**
	 * @property {PIXI.renderer} renderer - game renderer to pre-render objects to textures.
	 */
	get renderer(): PIXI.Renderer | PIXI.AbstractRenderer { return this._game.renderer; }

	/**
	 * @property {Gibbon.Game} game
	 */
	get game() { return this._game; }

	/**
	 * @property {Gibbon.Engine} engine
	 */
	get engine() { return this.game.engine; }

	/**
	 * @property {PIXI.Rectangle} viewRect
	 */
	get viewRect() { return this._game.screen; }

	readonly builds: Map<string, CreateFunction>;


	readonly _game: Game;

	/**
	 *
	 * @param {Gibbon.Game} game
	 */
	constructor(game: Game) {

		this._game = game;
		this.builds = new Map();

	}

	/**
	 * Associates a key with the given creator function, binding it to this factory
	 * instance.
	 * @param {string} key
	 * @param {Function} func
	 * @param {?object} data - data to pass as first argument to create function.
	 * @returns {Factory} this.
	 */
	addCreator(key: string, creator: CreateFunction, data?: any) {

		if (data) {
			creator = creator.bind(this, data);
		}

		this.builds.set(key, creator);
		return this;
	}

	/**
	 * Create a GameObject from the given key.
	 * @param {string} key
	 * @returns {GameObject} Object created.
	 */
	create(key: string, ...args: any[]): GameObject | null {

		let build = this.builds.get(key);
		if (build) {
			return build.apply(this, args);
		}
		return null;

	}

}