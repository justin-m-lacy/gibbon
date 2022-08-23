import { Container, DisplayObject } from 'pixi.js';
import Game from './game';
export declare type LayerData = {
    depth?: number;
    name?: string;
};
/**
 * Use to keep track of basic game layers.
 * Each layer is a separate PIXI.Container objects on the stage.
 * Possibly change these layers to Actors in the future, but at the moment
 * they're easier to deal with as raw PIXI Containers.
 */
export default class LayerManager {
    /**
     * @property {DisplayObject}
     */
    get background(): DisplayObject | undefined;
    /**
     * @property {DisplayObject}
     */
    get foreground(): DisplayObject | undefined;
    /**
     * @property {Container}
     */
    get objectLayer(): Container;
    /**
     * @property {Container}
     */
    get uiLayer(): Container | undefined;
    /**
     * @property {number}
     */
    get layerCount(): number;
    game: Game;
    _foreground?: DisplayObject;
    _background?: DisplayObject;
    _objectLayer: Container;
    _uiLayer?: Container;
    /**
     *
     * @param {Game} game
     */
    constructor(game: Game);
    /**
     * Add a layer to the stage.
     * @param {string} name - the name of the layer clip.
     * @param {number} index - index where the new clip is placed.
     * @returns {Container} the clip created.
     */
    addLayer(name: string, index?: number | null): Container;
    initFromData(layerData: LayerData[]): void;
}
