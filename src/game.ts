import { gsap } from 'gsap';
import LayerManager from './layerManager';
import Engine from './engine';
import PIXI from 'pixi.js';
import { Rectangle, DisplayObject, Container, InteractionEvent } from 'pixi.js';
import GameObject from './gameObject';
import Camera from './components/camera';
import Group from './group';
import Library from './library';
import Factory from './factory';
import { LayerData } from './layerManager';

/**
 * Extendable Game class.
 */
export default class Game {

	/**
	 * @property {PIXI.Application} app
	 */
	get app(): PIXI.Application { return this._app; }

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
	 * @property {GameObject} root - GameObject containing the main Camera component
	 * and base objectLayer.
	 * Basic game systems can also be added to root as Components.
	 */
	get root(): GameObject { return this._root!; }


	get objectLayer(): Container { return this.layerManager.objectLayer!; }

	get uiLayer(): Container { return this.layerManager._uiLayer!; }

	/**
	 * @property {PIXI.Container} backgroundLayer
	 */
	get backgroundLayer(): DisplayObject | undefined { return this._layerManager?.background; }

	/**
	 * @property {PIXI.Ticker} ticker - Game Ticker.
	 */
	get ticker() { return this._ticker; }
	/**
	 * @property {PIXI.Ticker} sharedTicker - Shared non-game ticker. (UI Elements, nonpausing effects.)
	*/
	get sharedTicker() { return this._sharedTicker; }

	/**
	 * @property {PIXI.utils.EventEmitter} emitter - Game-level Emitter. By default, the PIXI shared EventEmitter.
	 */
	get emitter() { return this._emitter; }

	/**
	 * @property {InteractionData} mouseInfo - convenience accessor for global mouse information.
	 */
	get mouseInfo() { return this.renderer.plugins.interaction.mouse; }

	/**
	 * @property {Factory} factory - Factory used for Object creation.
	 */
	get factory(): Factory | null { return this._factory ?? null; }
	set factory(v: Factory | null) {
		this._factory = v;
		this._engine.factory = v;
	}


	/**
	 * @property {number} wheelScale - Amount by which to scroll wheel input.
	 */
	wheelScale: number = 1;

	wheelEnabled: boolean = true;

	/**
	 * Stored value of wheel scrolling function when wheel is enabled.
	 */
	wheelFunc?: (e: WheelEvent) => void;

	/**
	 * @property {Group[]} groups
	 */
	get groups() { return this._groups; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this._engine; }

	/**
	 * @property {LayerManager} layerManager
	 */
	get layerManager(): LayerManager { return this._layerManager!; }

	_app: PIXI.Application;
	_screen: Rectangle;
	_stage: Container;

	_wheelScale: number = 1;
	_loader: PIXI.Loader;

	_groups: Group[];

	_ticker: PIXI.Ticker;
	_sharedTicker: PIXI.Ticker;

	_emitter: PIXI.utils.EventEmitter;

	_factory: Factory | null = null;
	_engine: Engine;
	library: Library;

	_layerManager?: LayerManager;

	_camera?: Camera;
	_root?: GameObject;

	/**
	 *
	 * @param {PIXI.Application} app - The pixi application, or options object.
	 */
	constructor(app: PIXI.Application) {

		GameObject.SetGame(this);

		this._app = app;
		this._screen = this._app.screen;
		this._stage = this._app.stage;
		this._stage.interactive = true;
		this._stage.hitArea = this._screen;

		this._wheelScale = 1;
		this._loader = PIXI.Loader.shared;

		this._groups = [];

		this._ticker = new PIXI.Ticker();
		this._sharedTicker = PIXI.Ticker.shared;

		this._emitter = new PIXI.utils.EventEmitter();

		this._engine = new Engine();
		this.library = this._engine.library;

	}

	/**
	 * After init(), layerManager and game layers are available for use.
	 */
	init(layerData?: LayerData[]) {

		this._engine.factory = this._factory;

		let layerManager = new LayerManager(this);
		if (layerData != null) {
			layerManager.initFromData(layerData);
		}

		this._layerManager = layerManager;
		this._engine.objectLayer = layerManager.objectLayer;

		this._root = this.engine.Instantiate(layerManager.objectLayer);
		this._camera = this.root.add(Camera);

	}

	/**
	 * Start the game object ticker and engine ticker.
	 */
	start() {

		this.ticker.add(this.engine.update, this.engine);
		this.ticker.start();
		this.engine.start();

	}

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
	on(event: string, func: PIXI.utils.EventEmitter.ListenerFn, context = null) {
		return this._emitter.on(event, func, context);
	}

	/**
	 * Emit event with game emitter.
	 * @param  {...any} args
	 */
	emit(...args: any) {
		this._emitter.emit.apply(this._emitter, args);
	}


	removeListener(evt: string, fn?: (evt: InteractionEvent) => void, context?: any) {
		return this._emitter.removeListener(evt, fn, context);
	}

	findGroup(name: string): Group | undefined {
		return this._groups.find((g) => g.name === name);
	}

	addGroup(g: Group) { this._groups.push(g); }

	/**
	 *
	 * @param {Group} g
	 * @returns {boolean} True if g was found and removed.
	 */
	removeGroup(g: Group): boolean {

		let ind = this._groups.indexOf(g);
		if (ind >= 0) {
			this._groups.splice(ind, 1);
			return true;
		}

		return false;

	}

	/**
	 * Wrapper for Engine.add(gameObject)
	 * @param {GameObject} gameObject
	 */
	addObject(gameObject: GameObject) { this._engine.add(gameObject); }

	/**
	 *
	 * @param {*} sys
	 */
	addUpdater(sys: any) { this._engine.addUpdater(sys); }

	/**
	 *
	 * @param {*} sys
	 */
	removeUpdater(sys: any) { this._engine.removeUpdater(sys); }

	/**
	 *
	 * @param {function} func
	 * @param {*} context
	 * @returns {PIXI.Ticker}
	 */
	addUpdate(func: (...params: any[]) => any, context?: any) {
		this.ticker.add(func, context);
	}

	/**
	 *
	 * @param {function} func
	 * @param {*} context
	 * @returns {PIXI.Ticker}
	 */
	removeUpdate(func: (...params: any[]) => any, context?: any) {
		return this.ticker.remove(func, context);
	}

	pause() { this._ticker.stop(); }
	unpause() { this._ticker.start(); }

	/**
	 * Wraps engine.Instantiate()
	 * Instantiate a GameObject with a clip or a named clonable object from the library.
	 * @param {DisplayObject} [clip=null]
	 * @param {PIXI.Point} [loc=null]
	 * @returns {GameObject}
	 */
	instantiate(clip = null, loc = null) {
		return this.engine.Instantiate(clip, loc);
	}

	/**
	 * Creates an empty game object with a Container clip.
	 * @param {Point|Object} [loc=null]
	 * @return {GameObject}
	 */
	makeEmpty(loc = null) {
		return this.engine.Instantiate(new PIXI.Container(), loc);
	}

	/**
	 * Replace existing tweens on the target with a newly created one.
	 * Convenience accesor for setting config data.
	 * @param {*} target
	 * @param {object} config
	 * @param {?number} time
	 * @returns {Tween} - The tween created.
	 */
	replaceTween(target: gsap.TweenTarget, config: gsap.TweenVars, time?: number) {

		if (time) {
			config.duration = time;
		}
		config.overwrite = true;
		return gsap.to(target, config);

	}

	/**
	 * Convenience function for creating new tween.
	 * @param {*} target - target of the Tween.
	 * @param {Object} config - configuration object for gsap tween.
	 * @param {?number} time - tween time.
	 * @returns {Tween}
	 */
	createTween(target: gsap.TweenTarget, config: gsap.TweenVars, time?: number) {

		if (time) config.duration = time;
		return gsap.to(target, config);

	}

	/**
	 * Enable mouse wheel events.
	 */
	enableWheel() {

		if (this.wheelEnabled === true) return;

		let mgr = this.app.renderer.plugins.interaction;

		this.wheelEnabled = true;

		// store to remove later.
		this.wheelFunc = (e) => {

			let evt = new PIXI.InteractionEvent();
			let data = new PIXI.InteractionData();

			data.originalEvent = e;

			/// TODO: PIXI has changed implementation for this:
			//data.deltaY = e.deltaY * this.wheelScale;
			//data.deltaX = e.deltaX * this.wheelScale;

			data.originalEvent = e;

			Object.assign(data, mgr.eventData);

			let target: DisplayObject | undefined = evt.target = data.target;
			evt.data = data;
			evt.type = 'wheel';

			while (target) {

				if (target.interactive === true) {
					evt.currentTarget = target;
					target.emit('wheel', evt);
				}
				target = target.parent;

			}

		};

		this.app.view.addEventListener('wheel', this.wheelFunc);

	}

	/**
	 * Disable wheel events.
	 */
	disableWheel() {

		if (this.wheelEnabled === true) {
			if (this.wheelFunc) {
				this.app.view.removeEventListener('wheel', this.wheelFunc);
			}
			this.wheelFunc = undefined;
			this.wheelEnabled = false;
		}

	}

}