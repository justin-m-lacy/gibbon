import { Container, DisplayObject } from 'pixi.js';
import { Game } from './game';

export type LayerData = {
	depth?: number,
	name?: string
}

/**
 * Use to keep track of basic game layers.
 * Each layer is a separate PIXI.Container objects on the stage.
 * Possibly change these layers to Actors in the future, but at the moment
 * they're easier to deal with as raw PIXI Containers.
 */
export class LayerManager {

	//get layers() { return this._layers;}

	/**
	 * @property {DisplayObject}
	 */
	get background(): DisplayObject | undefined { return this._background; }

	/**
	 * @property {DisplayObject}
	 */
	get foreground(): DisplayObject | undefined { return this._foreground; }

	/**
	 * @property {Container}
	 */
	get objectLayer(): Container { return this._objectLayer; }

	/**
	 * @property {Container}
	 */
	get uiLayer(): Container | undefined { return this._uiLayer; }

	/**
	 * @property {number}
	 */
	get layerCount() { return this.game.stage.children.length; }

	game: Game;

	_foreground?: DisplayObject;
	_background?: DisplayObject;
	_objectLayer: Container;
	_uiLayer?: Container;


	/**
	 *
	 * @param {Game} game
	 */
	constructor(game: Game) {

		this.game = game;

		this._background = this.addLayer('background');
		this._objectLayer = this.addLayer('object');
		this._uiLayer = this.addLayer('uiLayer');

	}

	/**
	 * Add a layer to the stage.
	 * @param {string} name - the name of the layer clip.
	 * @param {number} index - index where the new clip is placed.
	 * @returns {Container} the clip created.
	 */
	addLayer(name: string, index?: number | null): Container {

		const clip = new Container();
		clip.name = name;
		if (index === null || index === undefined) {
			this.game.stage.addChild(clip);
		}
		else this.game.stage.addChildAt(clip, index);

		return clip;

	}

	initFromData(layerData: LayerData[]) {

		const stage = this.game.stage;
		for (const data of layerData) {

			const clip = new Container();
			clip.name = data.name || '';

			if (data.depth) {
				this.game.stage.addChildAt(clip, data.depth);
			}
			else stage.addChild(clip);


		}

	}

}