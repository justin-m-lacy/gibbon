import { Group } from "./core/group";
import type { Container, Loader } from "pixi.js";
import type { Game } from './game';

/**
 * Group with methods for defining, loading, and managing assets.
 */
export class LoadGroup extends Group {

	/**
	 * @property {PIXI.Loader} loader
	 */
	get loader() { return this._loader || this._loadGame.loader; }

	/**
	 * @property {LayerManager} layerManager - Wrapper for Game layer manager.
	 */
	get layerManager() { return this._loadGame.layerManager; }

	_loader: Loader | null = null;

	private _loadGame: Game;

	/**
	 * @param {Game} game
	 * @param {DisplayObject} [clip=null]
	 * @param {Loader} [loader=null] - Loader to use for loading resources. If null,
	 * the game's shared loader is used.
	 * @param {Boolean} [createObject=false] - Whether to create a Actor for the group.
	 * If true, a new container is created for the group clip.
	 */
	constructor(game: Game,
		clip: Container | null | undefined = null,
		loader: Loader | null = null) {

		super(clip);

		this._loadGame = game;

		if (loader) {
			this._loader = loader;
		}

	}

	load() {

		const loader = this.loader;

		if (this.addAssets) {
			this.addAssets(loader);
		}

		loader.load();

	}

	addAssets?(loader: Loader): void;

	/**
	 * Define in subclasses to add loading assets before load() is called.
	 */
	//addAssets( loader ) {}

	/**
	 * Called after all assets have been loaded.
	 */
	loaded() {
	}

	destroy() {

		console.log('destroying load group');
		this._loader = null;
		if (this.actor) {
			this.actor.destroy();
		}

		super.destroy();

	}

}