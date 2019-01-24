import { Container } from "pixi.js";

/**
 * Handles basic layers.
 */
export default class LayerManager {

	//get layers() { return this._layers;}

	/**
	 * {DisplayObject}
	 */
	get background() { return this._background; }

	/**
	 * {DisplayObject}
	 */
	get foreground() { return this._foreground; }

	/**
	 * {Container}
	 */
	get objectLayer() { return this._objectLayer; }

	/**
	 * {Container}
	 */
	get uiLayer() { return this._uiLayer;}

	/**
	 * {number}
	 */
	get layerCount() { return this.stage.children.length; }

	/**
	 * 
	 * @param {Game} game 
	 */
	constructor(game){

		this.game = game;
		this.stage = game.stage;
		//this._layers = [];

	}

	/**
	 * Add a layer to the stage.
	 * @param {string} name - the name of the layer clip.
	 * @param {number} at - index where the new clip is placed.
	 * @returns {Container} the clip created.
	 */
	addLayer( name, at ) {

		let clip = new Container();
		clip.name = name;
		if ( at === null || at === undefined ) this.stage.addChild( clip );
		else this.stage.addChildAt( clip, at );

		return clip;

	}

	/**
	 * 
	 * @param {*} layerData 
	 */
	initLayers( layerData=null ) {

		let stage = this.stage;

		let clip = new Container();
		clip.name = 'background';
		stage.addChild( clip );
		this._background = clip;

		clip = new Container();
		clip.name = "objects";
		stage.addChild( clip );
		this._objectLayer = clip;
	
		clip = new Container();
		clip.name = 'uiLayer';
		stage.addChild( clip );
		this._uiLayer = clip;
	
	}

	/**
	 * 
	 * @param {*} layerData 
	 */
	initFromData( layerData ) {

		let stage = this.game.stage;
		for( let data of layerData ) {

			var clip = new Container();
			clip.name = data.name || '';

			if ( data.depth ) this.stage.addChildAt( clip, data.depth );
			else stage.addChild(clip);


		}

	}

}