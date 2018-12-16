import Group from "./group";
import { DisplayObject, Container } from "pixi.js";

/**
 * Group with methods for defining, loading, and managing assets.
 */
export default class LoadGroup extends Group {

	get loader() { return this._loader || this.game.loader; }

	/**
	 * {LayerManager} Wrapper for Game layer manager.
	 */
	get layerManager() { return this._game.layerManager; }

	/**
	 * {GameObject}
	 */
	get gameObject() { return this._gameObject; }

	/**
	 * @param {Game} game 
	 * @param {DisplayObject} [clip=null]
	 * @param {Loader} [loader=null] - Loader to use for loading resources. If null,
	 * the game's shared loader is used.
	 * @param {Boolean} [createObject=false] - Whether to create a GameObject for the group.
	 * If true, a new container is created for the group clip.
	 */
	constructor(game, clip=null, loader=null, createObject=false ) {

		super(game, clip);
	
		if ( loader ) this._loader = loader;
		if ( createObject) this.makeGroupObject( new Container() );

	}

	load() {

		let loader = this.loader;

		if ( this.addAssets ) this.addAssets( loader );

		loader.load();

	}

	/**
	 * Define in subclasses to add loading assets before load() is called.
	 */
	//addAssets( loader ) {}

	/**
	 * Ensure the group has its own group GameObject.
	 */
	makeGroupObject( clip ) {
		this._gameObject = this._gameObject || this._engine.Instantiate(clip);
		return this._gameObject;
	}

	/**
	 * Called after all assets have been loaded.
	 */
	loaded() {
	}

	destroy() {

		this._loader = null;
		if ( this._gameObject ) this._gameObject.Destroy();

		super.destroy();

	}

}