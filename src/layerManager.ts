import { Container } from 'pixi.js';
import type { DisplayObject } from 'pixi.js';
import type { Game } from './game';

export type LayerData = {
	depth?: number,
	name?: string
}

export type LayerOptions = {

	baseLayer?: Container,
	objects?: Container,
	background?: Container,
	uiLayer?: Container,
	foreground?: Container,
	layers?: LayerData[]
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
	get layerCount() { return this._objectLayer.parent.children.length }

	_foreground?: DisplayObject;
	_background?: DisplayObject;
	_objectLayer: Container;
	_uiLayer?: Container;


	private _baseLayer: Container;

	/**
	 *
	 * @param opts - Set initial LayerManager containers.
	 * @param opts.baseLayer - Layer to use as the base of all others.
	 * Defaults to game.stage.
	 * @param opts.layers - Additional layers to create.
	 */
	constructor(game: Game,
		opts?: LayerOptions) {

		this._baseLayer = opts?.baseLayer ?? game.stage;
		this._objectLayer = opts?.objects ?? this.createLayer('objects');

		if (opts) {

			this._uiLayer = opts.uiLayer;
			this._background = opts.background;
			this._foreground = opts.foreground;

			if (opts.layers) {
				this.initFromData(opts.layers);
			}

		} else {
			this._background = this.createLayer('background');
			this._uiLayer = this.createLayer('uiLayer');
		}

	}

	addLayer(container: Container) {

		if (container.parent === null) {
			this._baseLayer.addChild(container);
		}

	}

	/**
	 * Add a layer to the stage.
	 * @param {string} name - the name of the layer clip.
	 * @param {number} index - index where the new clip is placed.
	 * @returns {Container} the clip created.
	 */
	createLayer(name: string, index?: number | null): Container {

		const clip = new Container();
		clip.name = name;
		if (index === null || index === undefined) {
			this._baseLayer.addChild(clip);
		}
		else this._baseLayer.addChildAt(clip, index);

		return clip;

	}

	private initFromData(layerData: LayerData[]) {

		const base = this._baseLayer;
		for (const data of layerData) {

			const clip = new Container();
			clip.name = data.name || '';

			if (data.depth) {
				base.addChildAt(clip, data.depth);
			}
			else base.addChild(clip);


		}

	}

}