import Group from "./core/group";
import { DisplayObject, Container, Loader } from "pixi.js";
import { GameObject } from "..";
import Game from './game';

/**
 * Group with methods for defining, loading, and managing assets.
 */
export default class LoadGroup extends Group {

	/**
	 * @property {PIXI.Loader} loader
	 */
	get loader() { return this._loader || this.game.loader; }

	/**
	 * @property {LayerManager} layerManager - Wrapper for Game layer manager.
	 */
	get layerManager() { return this.game.layerManager; }

	_loader: Loader | null = null;

	/**
	 * @param {Game} game
	 * @param {DisplayObject} [clip=null]
	 * @param {Loader} [loader=null] - Loader to use for loading resources. If null,
	 * the game's shared loader is used.
	 * @param {Boolean} [createObject=false] - Whether to create a GameObject for the group.
	 * If true, a new container is created for the group clip.
	 */
	constructor(game: Game,
		clip: Container | null | undefined = null,
		loader: Loader | null = null,
		createObject: boolean = false) {

		super(game, clip);

		if (loader) {
			this._loader = loader;
		}
		if (createObject) {
			this.makeGroupObject();
		}

	}

	load() {

		let loader = this.loader;

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
		if (this.gameObject) {
			this.gameObject.destroy();
		}

		super.destroy();

	}

}