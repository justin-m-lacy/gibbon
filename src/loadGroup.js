import Group from "./group";
import { DisplayObject } from "pixi.js";

/**
 * Group with methods for defining, loading, and managing assets.
 */
export default class LoadGroup extends Group {

	get loader() { return this._loader || this.game.loader; }

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
	 * If true, the Group's clip will be used as the GameObject's clip.
	 */
	constructor(game, clip=null, loader=null, createObject=false ) {

		super(game, clip);

		console.log('creating load group');
	
		if ( loader ) this._loader = loader;
		if ( createObject) this.makeGroupObject( clip );

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
		return ( this._gameObject = this._gameObject || this._engine.Instantiate( clip ) );
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