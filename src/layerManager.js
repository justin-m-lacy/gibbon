import { Container } from "pixi.js";

/**
 * Handles basic layers.
 */
export default class LayerManager {

	get layers() { return this._layers;}

	get background() { return this._background; }
	get foreground() { return this._foreground; }
	get objectLayer() { return this._objectLayer; }
	get uiLayer() { return this._uiLayer;}

	constructor(game){

		this.game = game;
		this._layers = [];

	}

	/**
	 * Add a layer to the stage.
	 * @param {string} name - the name of the layer clip.
	 * @returns {Container} the clip created.
	 */
	addLayer( name ) {

		let clip = new Container();
		clip.name = name;
		this.game.stage.addChild( clip );
		return clip;

	}

	initLayers( layerData=null ) {

		let stage = this.game.stage;

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