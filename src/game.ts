import * as PIXI from 'pixi.js';
import { Rectangle, DisplayObject, Container, Point, Application, Ticker } from 'pixi.js';
import { LayerManager } from './layerManager';
import { Engine } from './engine';
import { Actor } from './core/actor';
import { Camera } from './components/camera';
import { Group } from './core/group';
import { Library } from './library';
import { LayerData } from './layerManager';
import { Tween } from '@tweenjs/tween.js';
import { tweenOf } from './utils/tweens';
import { contains } from './utils/array-utils';
import { WheelControl } from './input/mouse-wheel';
import EventEmitter from 'eventemitter3';
import type { IUpdater } from './engine';

/**
 * Extendable Game class.
 */
export class Game {

	static current: Game;

	/**
	 * @property {Application} app
	 */
	get app(): Application { return this._app; }

	/**
	 * @property {PIXI.Renderer} renderer - renderer for application.
	 * Convenience accessor. Cache for quick access.
	 */
	get renderer() { return this._app.renderer; }

	/**
	 * @property {PIXI.Container} stage
	 */
	get stage() { return this._app.stage; }

	/**
	 * @property {PIXI.Loader} loader
	 */
	get loader() { return this._loader; }
	set loader(v) { this._loader = v; }

	/**
	 * @property {PIXI.Rectangle} screen - Screen/View Rectangle.
	 */
	get screen() { return this._app.screen; }

	get camera() { return this._camera; }

	/**
	 * @property {Actor} root - Actor containing the main Camera component
	 * and base objectLayer.
	 * Basic game systems can also be added to root as Components.
	 */
	get root(): Actor { return this._root; }

	get objectLayer(): Container { return this.layerManager.objectLayer!; }

	get uiLayer(): Container { return this.layerManager._uiLayer!; }

	/**
	 * @property {PIXI.Container} backgroundLayer
	 */
	get backgroundLayer(): DisplayObject | undefined { return this._layerManager?.background; }

	/**
	 * @property ticker - Game Ticker.
	 */
	get ticker() { return this.engine.ticker; }

	/**
	 * @property sharedTicker - Shared non-game ticker. (UI Elements, nonpausing effects.)
	*/
	get sharedTicker() { return Ticker.shared; }

	/**
	 * @property emitter - Game-level Emitter. By default, the PIXI shared EventEmitter.
	 */
	get emitter() { return this._emitter; }

	/**
	 * @property {InteractionData} mouseInfo - convenience accessor for global mouse information.
	 */
	get mouseInfo() { return this.renderer.plugins.interaction.mouse; }


	get groups() { return this._groups; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this._engine; }

	/**
	 * @property {LayerManager} layerManager
	 */
	get layerManager(): LayerManager { return this._layerManager!; }

	private readonly _app: Application;

	private _loader: PIXI.Loader;

	private readonly _groups: Group[] = [];

	/**
	 * Root object. Not accessible before init() is called.
	 */
	private _root!: Actor;

	private _emitter: EventEmitter = new EventEmitter();

	private _engine: Engine;
	readonly library: Library = new Library();

	private _layerManager?: LayerManager;

	private _camera?: Camera;

	/**
	 *
	 * @param app - The pixi application, or options object.
	 */
	constructor(app: Application) {

		this._app = app;
		this.app.stage.interactive = true;
		this.app.stage.hitArea = this._app.screen;

		Game.current = this;
		this._loader = PIXI.Loader.shared;

		this._engine = new Engine(new Ticker());

	}

	/**
	 * After init(), layerManager and game layers are available for use.
	 */
	init(layerData?: LayerData[]) {

		const layerManager = new LayerManager(this);
		if (layerData != null) {
			layerManager.initFromData(layerData);
		}

		this._layerManager = layerManager;
		this._engine.objectLayer = layerManager.objectLayer;

		this._root = new Actor(layerManager.objectLayer);
		this._camera = this.root.add(Camera, this._app.screen);
		this.addActor(this._root);

	}

	/**
	 * Start the game object ticker and engine ticker.
	 */
	start() {
		this.engine.start();
	}

	pause() { this._engine.stop(); }
	unpause() { this._engine.start(); }

	/**
	 * Size the game to the full browser window.
	 * @returns {function} The resize event listener, so it can be removed later.
	 */
	fullscreen() {

		this.app.renderer.resize(document.body.clientWidth, document.body.clientHeight);

		const resizer = () => {
			this.app.renderer.resize(
				document.body.clientWidth,
				document.body.clientHeight);
			if (this._camera != null) {
				this.camera!.resized(this.app.screen);
			}
		};
		window.addEventListener('resize', resizer);

		return resizer;

	}

	/**
	 * Wrapper for default game event emitter.
	 * @param {string} event
	 * @param {Function} func
	 * @param {*} [context=null]
	 * @returns {PIXI.utils.EventEmitter}
	 */
	on(event: string, func: (...args: any[]) => void, context?: any) {
		return this._emitter.on(event, func, context);
	}

	/**
	 * Emit event with game emitter.
	 * @param  {...any} args
	 */
	emit(evt: string, ...args: any[]) {
		this._emitter.emit(evt, args);
	}


	off(evt: string, fn?: (...args: any[]) => void, context?: any) {
		return this._emitter.off(evt, fn, context);
	}

	findGroup(name: string): Group | undefined {
		return this._groups.find((g) => g.name === name);
	}

	/**
	 * Add group to game. Attempting to add the same group multiple
	 * times to a game will be ignored.
	 * @param g 
	 */
	addGroup(g: Group) {
		if (!contains(this._groups, g)) {
			this._groups.push(g);
			g._onAdded(this);
		}
	}

	/**
	 * Remove group from game.
	 * @param {Group} g
	 * @returns {boolean} True if g was found and removed.
	 */
	removeGroup(g: Group): boolean {

		const ind = this._groups.indexOf(g);
		if (ind >= 0) {
			this._groups.splice(ind, 1);
			g._onRemoved();
			return true;
		}

		return false;

	}

	/**
	 * Wrapper for Engine.add(actor)
	 * @param {Actor} actor
	 */
	addActor(actor: Actor) {
		this._engine.add(actor);
	}

	/**
	 *
	 * @param {*} sys
	 */
	addUpdater(sys: IUpdater) { this._engine.addUpdater(sys); }

	/**
	 *
	 * @param {*} sys
	 */
	removeUpdater(sys: IUpdater) { this._engine.removeUpdater(sys); }

	/**
	 * Wraps engine.Instantiate()
	 * Instantiate a Actor with a clip or a named clonable object from the library.
	 */
	instantiate(clip?: DisplayObject | null | string, loc?: PIXI.Point) {

		const view = (typeof clip === 'string') ? this.library.instance<DisplayObject>(clip, loc) : clip;
		const go = new Actor(view ?? undefined, loc);

		this.engine.add(go);
		return go;

	}

	/**
	 * Create an empty game object with a Container clip.
	 */
	makeContainer(loc?: Point) {
		return this.instantiate(new Container(), loc);
	}

	/**
	 * Create empty game object with no clip.
	 */
	makeEmpty(loc?: PIXI.Point) {
		return this.instantiate(null, loc);
	}

	/**
	 * Replace existing tweens on the target with a newly created one.
	 * Convenience accesor for setting config data.
	 * @param {*} target
	 * @param {object} config
	 * @param {?number} time
	 * @returns {Tween} - The tween created.
	 */
	replaceTween<T extends Object>(target: T, props: Record<string, any>, time?: number): Tween<T> {
		return tweenOf(target).to(props, time);
	}

	/**
	 * Convenience function for creating new tween.
	 * @param {*} target - target of the Tween.
	 * @param {Object} config - configuration object for gsap tween.
	 * @param {?number} time - tween time.
	 * @returns {Tween}
	 */
	createTween<T extends Object>(target: T, props: any, time?: number) {

		return new Tween(target).to(props, time);

	}

	/**
	 * Enable mouse wheel events.
	 */
	enableWheel() {
		WheelControl.enableWheel(this.app);
	}

	/**
	 * Disable wheel events.
	 */
	disableWheel() {
		WheelControl.disableWheel(this.app);
	}

}