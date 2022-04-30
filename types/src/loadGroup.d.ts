import Group from "./group";
import { Container, Loader } from "pixi.js";
import Game from './game';
/**
 * Group with methods for defining, loading, and managing assets.
 */
export default class LoadGroup extends Group {
    /**
     * @property {PIXI.Loader} loader
     */
    get loader(): Loader;
    /**
     * @property {LayerManager} layerManager - Wrapper for Game layer manager.
     */
    get layerManager(): import("./layerManager").default;
    _loader: Loader | null;
    /**
     * @param {Game} game
     * @param {DisplayObject} [clip=null]
     * @param {Loader} [loader=null] - Loader to use for loading resources. If null,
     * the game's shared loader is used.
     * @param {Boolean} [createObject=false] - Whether to create a GameObject for the group.
     * If true, a new container is created for the group clip.
     */
    constructor(game: Game, clip?: Container | null | undefined, loader?: Loader | null, createObject?: boolean);
    load(): void;
    addAssets?(loader: Loader): void;
    /**
     * Define in subclasses to add loading assets before load() is called.
     */
    /**
     * Called after all assets have been loaded.
     */
    loaded(): void;
    destroy(): void;
}
