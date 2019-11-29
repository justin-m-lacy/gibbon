import GameObject from './gameObject';
import Library from './library';
import {quickSplice } from '../utils/arrayUtils';
import * as PIXI from 'pixi.js';

export default class Engine {

	/**
	 * @property {Library} library
	 */
	get library() { return this._lib; }
	set library(v) { this._lib = v;}

	/**
	 * @property {Factory} factory
	 */
	get factory() { return this._factory; }
	set factory(v) { this._factory=v;}

	/**
	 * @property {GameObject[]} objects
	 */
	get objects() { return this._objects; }

	/**
	 * @property {Container} objectLayer
	 */
	get objectLayer() { return this._objectLayer; }
	set objectLayer(v) { this._objectLayer = v;}

	/**
	 * @property {Object[]} updaters - Updaters are for systems or objects with update
	 * functions that don't require complex GameObjects.
	 */
	get updaters() { return this._updaters; }

	/*get ticker() {return this._ticker; }
	set ticker(v) { this._ticker =v; }

	get sharedTicker() { return this._sharedTicker; }
	set sharedTicker(v) { this._sharedTicker=v;}*/

	constructor(){

		this._objects = [];
		this._updaters = [];

		this._lib = new Library();


		//this.ticker = PIXI.Ticker.shared;

		GameObject.SetEngine(this);
	}

	/**
	 *
	 * @param {string} key
	 * @param {Point} [loc=null]
	 * @param {Object} [vars=null] variables to use in creating the new object.
	 * @returns {GameObject}
	 */
	Create( key, loc=null, vars=null) {

		let go = this._factory.create( key, loc, vars );
		this.add(go);

		return go;
	}

	/**
	 * Instantiate a GameObject with a clip or a named clonable object from the library.
	 * @param {DisplayObject} [clip=null]
	 * @param {PIXI.Point} [loc=null]
	 * @returns {GameObject}
	 */
	Instantiate( clip=null, loc=null ) {

		if ( typeof clip === 'string' ) {
			 clip = this._lib.instance(clip, loc);
		}
		let go = new GameObject( clip, loc );

		this.add( go );
		return go;

	}

	start() {
	}

	stop(){
	}

	/**
	 * Add GameObject to the engine.
	 * @param {GameObject} obj
	*/
	add(obj) {

		if ( obj === null || obj === undefined ) {
			console.log('ERROR: engine.add() object is null');
			return;
		}

		if ( obj.clip !== null && obj.clip.parent === null ) {
			this._objectLayer.addChild( obj.clip );
		}

		obj._added();

		this._objects.push(obj);

	}

	/**
	 *
	 * @param {System|Object} sys
	 */
	addUpdater( sys ) {
		this._updaters.push( sys );
	}

	/**
	 *
	 * @param {System|Object} sys
	 */
	removeUpdater( sys ) {

		let ind = this._updaters.indexOf(sys);
		if ( ind >= 0 ) {
			this._updaters.splice(ind,1);
		}

	}

	update( delta ) {

		let objs = this._updaters;
		for( let i = objs.length-1; i>=0; i-- ) {
			objs[i].update( delta );
		}

		objs = this._objects;

		for( let i = objs.length-1; i>=0; i-- ) {

			var obj = objs[i];
			if ( obj.destroyed === true ) {

				obj._destroy();
				quickSplice( objs, i );

			} else if ( obj.active ) obj.update( delta );

		}

	}

	/**
	 * Remove a GameObject from the Engine.
	 * @param {GameObject} obj
	 * @returns {boolean}
	 */
	remove( obj ) {

		let ind = this._objects.indexOf(obj);
		if ( ind < 0 ) return false;

		this._objects.splice( ind, 0 );

		//this._objects[ind] = this._objects[ this._objects.length-1];
		//this._objects.pop();

		return true;

	}

	/**
	 * Destroy a game object.
	 * @param {GameObject} obj
	 */
	destroy(obj) {

		if ( obj.destroyed !== true ) {

			obj.destroy();

		}

	}

}