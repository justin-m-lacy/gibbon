import { Container, DisplayObject } from 'pixi.js';
import Game from './game';

/**
 * Use to keep track of basic game layers.
 * Each layer is a separate PIXI.Container objects on the stage.
 * Possibly change these layers to GameObjects in the future, but at the moment
 * they're easier to deal with as raw PIXI Containers.
 */
export default class LayerManager {

	//get layers() { return this._layers;}

	/**
	 * @property {DisplayObject}
	 */
	get background(): DisplayObject { return this._background; }

	/**
	 * @property {DisplayObject}
	 */
	get foreground(): DisplayObject { return this._foreground; }

	/**
	 * @property {Container}
	 */
	get objectLayer(): Container { return this._objectLayer; }

	/**
	 * @property {Container}
	 */
	get uiLayer(): Container { return this._uiLayer; }

	/**
	 * @property {number}
	 */
	get layerCount() { return this.game.stage.children.length; }

	game: Game;


	/**
	 *
	 * @param {Game} game
	 */
	constructor(game: Game) {

		this.game = game;
		//this._layers = [];

	}

	/**
	 * Add a layer to the stage.
	 * @param {string} name - the name of the layer clip.
	 * @param {number} index - index where the new clip is placed.
	 * @returns {Container} the clip created.
	 */
	addLayer(name: string, index: number): Container {

		let clip = new Container();
		clip.name = name;
		if (index === null || index === undefined) this.game.stage.addChild(clip);
		else this.game.stage.addChildAt(clip, index);

		return clip;

	}

	/**
	 * @todo extend this functionality.
	 * @param {object} [layerData=null]
	 */
	initLayers(layerData = null) {

		let stage = this.stage;

		let clip = new Container();
		clip.name = 'background';
		stage.addChild(clip);
		this._background = clip;

		clip = new Container();
		clip.name = "objects";
		stage.addChild(clip);
		this._objectLayer = clip;

		clip = new Container();
		clip.name = 'uiLayer';
		stage.addChild(clip);
		this._uiLayer = clip;

	}

	/**
	 *
	 * @param {*} layerData
	 */
	initFromData(layerData: any) {

		let stage = this.game.stage;
		for (let data of layerData) {

			var clip = new Container();
			clip.name = data.name || '';

			if (data.depth) this.game.stage.addChildAt(clip, data.depth);
			else stage.addChild(clip);


		}

	}

}