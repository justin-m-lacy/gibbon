import {TweenMax} from 'gsap';
import LayerManager from './layerManager';
import Engine from './engine';
import * as PIXI from 'pixi.js';
import GameObject from './gameObject';
import Camera from './components/camera';

/**
 * Extendable Game class.
 */
export default class Game {

	/**
	 * {PIXI.Application}
	 */
	get app() {return this._app;}

	/**
	 * {PIXI.Container}
	 */
	get stage() { return this._stage;}

	/**
	 * {PIXI.Rectangle} - Screen/View Rectangle.
	 */
	get screen() { return this._screen;}

	/**
	 * {Camera} Camera component.
	 */
	get camera() { return this._camera; }

	/**
	 * {GameObject} GameObject containing the main Camera component
	 * and base objectLayer.
	 */
	get rootObject() { return this._rootObject; }


	/**
	 * {PIXI.Container}
	 */
	get objectLayer() { return this._objectLayer; }

	/**
	 * {PIXI.Container} Container for ui objects.
	 */
	get uiLayer() { return this._uiLayer; }

	get backgroundLayer() { return this._layerManager.background; }

	/**
	 * {PIXI.ticker.Ticker} - Game Ticker.
	 */
	get ticker() { return this._ticker; }
	/**
	 * {PIXI.ticker.Ticker} - Shared non-game ticker. (UI Elements, nonpausing effects.)
	*/
	get sharedTicker() { return this._sharedTicker; }

	/**
	 * {PIXI.utils.EventEmitter} Game-level Emitter. By default, the PIXI shared EventEmitter.
	 */
	get emitter() { return this._emitter;}

	/**
	 * {Factory} Factory used for Object creation.
	 */
	get factory() { return this._factory; }
	set factory(v) {
		this._factory = v;
		this._engine.factory = v;
	}

	/**
	 * {Engine}
	 */
	get engine() { return this._engine; }

	get layerManager() { return this._layerManager; }

	/**
	 * 
	 * @param {PIXI.Application} app 
	 */
	constructor( app ) {

		this._app = app;
		this._screen = app.screen;
		this._stage = app.stage;
		this._stage.interactive = true;
		this._stage.hitArea = this._screen;

		this._ticker = new PIXI.ticker.Ticker();
		this._sharedTicker = PIXI.ticker.shared;

		this._emitter = new PIXI.utils.EventEmitter();

		this._engine = new Engine();
		this.library = this._engine.library;

		GameObject.setGame( this );

	}

	/**
	 * After init(), game layers will be available for use.
	 * @param {*} layerData 
	 */
	init( layerData=null ) {

		this._engine.factory = this._factory;
		let layerManager = new LayerManager(this);


		layerManager.initLayers( layerData );
		this._layerManager = layerManager;
		this._objectLayer = this._engine.objectLayer = layerManager.objectLayer;
		this._uiLayer = layerManager.uiLayer;

		this._rootObject = this.engine.Instantiate( this._objectLayer );
		this._camera = this.rootObject.add( Camera );
		console.log('adding Camera');

	}

	start() {

		console.log('game start()');
		this.ticker.add( this.engine.update, this.engine );
		this.ticker.start();
		this.engine.start();

	}


	/**
	 * Wrapper for Engine.add(gameObject)
	 * @param {GameObject} gameObject 
	 */
	addObject(gameObject){ this._engine.add( gameObject); }

	addUpdater( sys ) { this._engine.addUpdater(sys); }
	removeUpdater(sys) { this._engine.removeUpdater(sys);}

	addUpdate( func, context ) {
		this.ticker.add( func, context );
	}

	removeUpdate( func, context ){
		this.ticker.remove(func, context);
	}

	pause() { this._ticker.stop(); }
	unpause() { this._ticker.start(); }

	/**
	 * Creates an empty game object with a Container clip.
	 * @param {Point|Object} loc 
	 */
	makeEmpty( loc=null ) {
		return this.engine.Instantiate( new PIXI.Container(), loc );
	}

	/**
	 * 
	 * @param {*} target - target of the Tween. 
	 * @param {Number} time - tween time.
	 * @param {Object} config - configuration object for TweenMax tween.
	 */
	createTween( target, time, config ) {
		return TweenMax.to( target, time, config );
	}

}