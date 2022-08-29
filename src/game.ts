import * as PIXI from 'pixi.js';
import { Rectangle, DisplayObject, Container, Point, Application } from 'pixi.js';
import LayerManager from './layerManager';
import Engine from './engine';
import Actor from './core/actor';
import Camera from './components/camera';
import Group from './core/group';
import Library from './library';
import { LayerData } from './layerManager';
import { Tween } from '@tweenjs/tween.js';
import { tweenOf } from './utils/tweens';
import { contains } from './utils/array-utils';
import { IUpdater } from './engine';
import { WheelControl } from './input/mouse-wheel';

/**
 * Extendable Game class.
 */
export default class Game {

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
	get stage() { return this._stage; }

	/**
	 * @property {PIXI.Loader} loader
	 */
	get loader() { return this._loader; }
	set loader(v) { this._loader = v; }

	/**
	 * @property {PIXI.Rectangle} screen - Screen/View Rectangle.
	 */
	get screen(): Rectangle { return this._screen; }

	get camera(): Camera | undefined { return this._camera; }

	/**
	 * @property {Actor} root - Actor containing the main Camera component
	 * and base objectLayer.
	 * Basic game systems can also be added to root as Components.
	 */
	get root(): Actor { return this._defaultGroup._actor!; }

	get defaultGroup(): Group { return this._defaultGroup; }

	get objectLayer(): Container { return this.layerManager.objectLayer!; }

	get uiLayer(): Container { return this.layerManager._uiLayer!; }

	/**
	 * @property {PIXI.Container} backgroundLayer
	 */
	get backgroundLayer(): DisplayObject | undefined { return this._layerManager?.background; }

	/**
	 * @property {PIXI.Ticker} ticker - Game Ticker.
	 */
	get ticker() { return this.engine.ticker; }

	/**
	 * @property {PIXI.Ticker} sharedTicker - Shared non-game ticker. (UI Elements, nonpausing effects.)
	*/
	get sharedTicker() { return PIXI.Ticker.shared; }

	/**
	 * @property {PIXI.utils.EventEmitter} emitter - Game-level Emitter. By default, the PIXI shared EventEmitter.
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

	private _app: Application;
	private _screen: Rectangle;
	private _stage: Container;

	private _loader: PIXI.Loader;

	private _groups: Group[];

	/**
	 * Default group for added objects.
	 */
	private _defaultGroup!: Group;

	private _emitter: PIXI.utils.EventEmitter;

	private _engine: Engine;
	library: Library;

	private _layerManager?: LayerManager;

	private _camera?: Camera;

	/**
	 *
	 * @param app - The pixi application, or options object.
	 */
	constructor(app: Application) {

		this._app = app;
		this._screen = this._app.screen;
		this._stage = this._app.stage;
		this._stage.interactive = true;
		this._stage.hitArea = this._screen;

		Game.current = this;
		this._loader = PIXI.Loader.shared;

		this._groups = [];

		this._emitter = new PIXI.utils.EventEmitter();

		this._engine = new Engine(new PIXI.Ticker());
		this.library = this._engine.library;

	}

	/**
	 * After init(), layerManager and game layers are available for use.
	 */
	init(layerData?: LayerData[]) {

		let layerManager = new LayerManager(this);
		if (layerData != null) {
			layerManager.initFromData(layerData);
		}

		this._layerManager = layerManager;
		this._engine.objectLayer = layerManager.objectLayer;

		this._defaultGroup = new Group(layerManager.objectLayer, false, true);
		this._camera = this.root.add(Camera);

		this.addGroup(this._defaultGroup);

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

		let resizer = () => {
			this.app.renderer.resize(
				document.body.clientWidth,
				document.body.clientHeight);
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
	on(event: string, func: PIXI.utils.EventEmitter.ListenerFn, context?: any) {
		return this._emitter.on(event, func, context);
	}

	/**
	 * Emit event with game emitter.
	 * @param  {...any} args
	 */
	emit(...args: any) {
		this._emitter.emit.apply(this._emitter, args);
	}


	off(evt: string, fn?: PIXI.utils.EventEmitter.ListenerFn, context?: any) {
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

		let ind = this._groups.indexOf(g);
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
	addObject(actor: Actor) {
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
	instantiate(clip?: DisplayObject, loc?: PIXI.Point) {
		return this.engine.Instantiate(clip, loc);
	}

	/**
	 * Create an empty game object with a Container clip.
	 */
	makeContainer(loc?: Point) {
		return this.engine.Instantiate(new PIXI.Container(), loc);
	}

	/**
	 * Create empty game object with no clip.
	 */
	makeEmpty(loc?: PIXI.Point) {
		return this.engine.Instantiate(null, loc);
	}

	/**
	 * Replace existing tweens on the target with a newly created one.
	 * Convenience accesor for setting config data.
	 * @param {*} target
	 * @param {object} config
	 * @param {?number} time
	 * @returns {Tween} - The tween created.
	 */
	replaceTween<T>(target: T, props: any, time?: number): Tween<T> {

		const tween = tweenOf(target);
		return tween.to(props, time);

	}

	/**
	 * Convenience function for creating new tween.
	 * @param {*} target - target of the Tween.
	 * @param {Object} config - configuration object for gsap tween.
	 * @param {?number} time - tween time.
	 * @returns {Tween}
	 */
	createTween<T>(target: T, props: any, time?: number) {

		const tween = new Tween(target);
		return tween.to(props, time);

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