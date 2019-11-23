import {gsap} from 'gsap';
import LayerManager from './layerManager';
import Engine from './engine';
import * as PIXI from 'pixi.js';
import GameObject from './gameObject';
import Camera from '../components/camera';
import { quickSplice } from '../utils/arrayUtils';

/**
 * Extendable Game class.
 */
export default class Game {

	/**
	 * @property {PIXI.Application} app
	 */
	get app() {return this._app;}

	/**
	 * @property {PIXI.Renderer} renderer - renderer for application.
	 * Convenience accessor. Cache for quick access.
	 */
	get renderer() {return this._app.renderer; }

	/**
	 * @property {PIXI.Container} stage
	 */
	get stage() { return this._stage;}

	/**
	 * @property {PIXI.Loader} loader
	 */
	get loader() { return this._loader;}
	set loader(v) { this._loader = v;}

	/**
	 * @property {PIXI.Rectangle} screen - Screen/View Rectangle.
	 */
	get screen() { return this._screen;}

	/**
	 * @property {Camera} camera - Camera component.
	 */
	get camera() { return this._camera; }

	/**
	 * @property {GameObject} root - GameObject containing the main Camera component
	 * and base objectLayer.
	 * Basic game systems can also be added to root as Components.
	 */
	get root() { return this._root; }

	/**
	 * @property {PIXI.Container} objectLayer
	 */
	get objectLayer() { return this._objectLayer; }

	/**
	 * @property {PIXI.Container} uiLayer - Container for ui objects.
	 */
	get uiLayer() { return this._uiLayer; }

	/**
	 * @property {PIXI.Container} backgroundLayer
	 */
	get backgroundLayer() { return this._layerManager.background; }

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
	get emitter() { return this._emitter;}

	/**
	 * @property {InteractionData} mouseInfo - convenience accessor for global mouse information.
	 */
	get mouseInfo(){ return this.renderer.plugins.interaction.mouse; }

	/**
	 * @property {Factory} factory - Factory used for Object creation.
	 */
	get factory() { return this._factory; }
	set factory(v) {
		this._factory = v;
		this._engine.factory = v;
	}

	/**
	 * @property {boolean} wheelEnabled - Whether wheel events are dispatched.
	 */
	get wheelEnabled() { return this._wheelEnabled; }

	/**
	 * @property {number} wheelScale - Amount by which to scroll wheel input.
	 */
	get wheelScale() { return this._wheelScale; }
	set wheelScale(v) { this._wheelScale = v; }

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
	get layerManager() { return this._layerManager; }

	/**
	 *
	 * @param {PIXI.Application|Object} app - The pixi application, or options object.
	 * If an options object is supplied, it is used to create a new PIXI.Application.
	 */
	constructor( app ) {

		this._app = ( app.constructor ) ? app : new PIXI.Application( app );

		GameObject.SetGame( this );

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
	 * @param {*} layerData
	 */
	init( layerData=null ) {

		this._engine.factory = this._factory;
		let layerManager = new LayerManager(this);

		layerManager.initLayers( layerData );
		this._layerManager = layerManager;
		this._objectLayer = this._engine.objectLayer = layerManager.objectLayer;
		this._uiLayer = layerManager.uiLayer;

		this._root = this.engine.Instantiate( this._objectLayer );
		this._camera = this.root.add( Camera );

	}

	/**
	 * Start the game object ticker and engine ticker.
	 */
	start() {

		this.ticker.add( this.engine.update, this.engine );
		this.ticker.start();
		this.engine.start();

	}

	/**
	 * Size the game to the full browser window.
	 * @returns {function} The resize event listener, so it can be removed later.
	 */
	fullscreen() {

		this.app.renderer.resize( document.body.clientWidth, document.body.clientHeight );

		let resizer = ()=>{
			this.app.renderer.resize(
				document.body.clientWidth,
				document.body.clientHeight );
		};
		window.addEventListener( 'resize', resizer );

		return resizer;

	}

	/**
	 * Wrapper for default game event emitter.
	 * @param {string} event
	 * @param {Function} func
	 * @param {*} [context=null]
	 * @returns {PIXI.utils.EventEmitter}
	 */
	on( event, func, context=null ) {
		return this._emitter.on( event, func, context );
	}

	/**
	 *
	 * @param {string} name
	 * @returns {?Group}
	 */
	findGroup(name) {
		return this._groups.find( (g)=>g.name===name );
	}

	/**
	 *
	 * @param {Group} g
	 */
	addGroup(g) {
		this._groups.push(g);
	}

	/**
	 *
	 * @param {Group} g
	 * @returns {boolean} True if g was found and removed.
	 */
	removeGroup(g) {

		for( let i = this._groups.length-1; i >= 0; i-- ) {
			if ( this._groups[i] === g) {
				quickSplice( this._groups, i );
				return true;
			}
		}
		return false;

	}

	/**
	 * Wrapper for Engine.add(gameObject)
	 * @param {GameObject} gameObject
	 */
	addObject(gameObject){ this._engine.add( gameObject); }

	/**
	 *
	 * @param {*} sys
	 */
	addUpdater( sys ) { this._engine.addUpdater(sys); }

	/**
	 *
	 * @param {*} sys
	 */
	removeUpdater(sys) { this._engine.removeUpdater(sys);}

	/**
	 *
	 * @param {function} func
	 * @param {*} context
	 * @returns {PIXI.Ticker}
	 */
	addUpdate( func, context ) {
		this.ticker.add( func, context );
	}

	/**
	 *
	 * @param {function} func
	 * @param {*} context
	 * @returns {PIXI.Ticker}
	 */
	removeUpdate( func, context ){
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
	instantiate( clip=null, loc=null ) {
		return this.engine.Instantiate(clip,loc);
	}

	/**
	 * Creates an empty game object with a Container clip.
	 * @param {Point|Object} [loc=null]
	 * @return {GameObject}
	 */
	makeEmpty( loc=null ) {
		return this.engine.Instantiate( new PIXI.Container(), loc );
	}

	/**
	 * Replace existing tweens on the target with a newly created one.
	 * Convenience accesor for setting config data.
	 * @param {*} target
	 * @param {object} config
	 * @param {?number} time
	 * @returns {Tween} - The tween created.
	 */
	replaceTween( target, config, time ) {

		if ( time ) config.duration = time;
		config.overwrite = 'all';
		return gsap.to( target, config );

	}

	/**
	 * Convenience function for creating new tween.
	 * @param {*} target - target of the Tween.
	 * @param {Object} config - configuration object for gsap tween.
	 * @param {?number} time - tween time.
	 * @returns {Tween}
	 */
	createTween( target, config, time ) {

		if ( time ) config.duration = time;
		return gsap.to( target, config );

	}

	/**
	 * Enable mouse wheel events.
	 */
	enableWheel() {

		if ( this._wheelEnabled === true ) return;

		let mgr = this.app.renderer.plugins.interaction;

		this._wheelEnabled = true;

		// store to remove later.
		this._wheelFunc = (e)=>{

			let evt = new PIXI.interaction.InteractionEvent();
			let data = new PIXI.interaction.InteractionData();

			data.originalEvent = e;
			data.deltaY = e.deltaY*this.wheelScale;
			data.deltaX = e.deltaX*this.wheelScale;

			data.originalEvent = e;

			Object.assign( data, mgr.eventData );

			let target = evt.target = data.target;
			evt.data = data;
			evt.type = 'wheel';

			while ( target ) {

				if ( target.interactive === true ) {
					evt.currentTarget = target;
					target.emit( 'wheel', evt );
				}
				target = target.parent;

			}

		};

		this.app.view.addEventListener( 'wheel', this._wheelFunc );

	}

	/**
	 * Disable wheel events.
	 */
	disableWheel(){

		if ( this._wheelEnabled === true ) {
			this.app.view.removeEventListener( 'wheel', this._wheelFunc );
			this._wheelFunc = null;
			this._wheelEnabled = false;
		}

	}

}