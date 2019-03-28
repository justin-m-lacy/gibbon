import {Point} from 'pixi.js';
import * as PIXI from 'pixi.js';
import { quickSplice } from '../utils/arrayutils';

/**
 * 
 */
export default class GameObject {

	static SetGame(v) {this.Game = v;}
	static GetGame(){ return this.Game; }

	static GetEngine() { return this.Engine;}
	static SetEngine(v) { this.Engine = v;}

	/**
	 * @property {Game} game
	 */
	get game() {
		return GameObject.Game;
	}

	/**
	 * @property {Group} group - owning group of the gameObject, if any.
	 */
	get group() { return this._group; }
	set group(v) { this._group = v;}

	/**
	 * @property {number} flags - bit-flags applied to this GameObject.
	 */
	get flags() { return this._flags; }
	set flags(v) { this._flags = v; }

	/**
	 * @property {string} name - Name of the GameObject.
	 */
	get name() { return this._name; }
	set name(v){this._name = v;}

	/**
	 * @property {boolean} active
	 */
	get active() { return this._active; }
	set active(v){this._active=v;}


	/**
	 * @property {Point} position - Position of the object and Display clip.
	 */
	get position() { return this._position; }
	set position(v) {

		this._position.set( v.x, v.y );

	}

	/**
	 * @property {number} x
	 */
	get x(){ return this._position.x; }
	set x(v) { this._position.x = v;}

	/**
	 * @property {number} y
	 */
	get y() { return this._position.y; }
	set y(v) { this._position.y = v; }

	/**
	 * @property {number} rotation - Rotation in radians.
	 */
	get rotation() { return this._clip.rotation; }
	set rotation(v) {
		if ( v > Math.PI ) v-= 2*Math.PI;
		else if ( v < -Math.PI) v += 2*Math.PI;
		this._clip.rotation = v;
	}

	/**
	 * @property {boolean} interactive - Set the interactivity for the GameObject.
	 * The setting is ignored if the GameObject has no clip.
	 */
	get interactive() { return this._clip ? this._clip.interactive : false; }
	set interactive(v) { if ( this._clip ) this._clip.interactive = v; }

	/**
	 * @property {EventEmitter3} emitter - the object clip's emitter, or a new emitter, if object has no clip.
	 */
	get emitter() { return this._clip ? this._clip : this._emitter; }

	/**
	 * @property {Point} orient - returns the normalized orientation vector of the object.
	 */
	get orient() {

		let rads = this.rotation;
		return new Point( Math.cos(rads), Math.sin(rads) );

	}

	/**
	 * @property {boolean} visible
	 */
	get visible() { return this._clip && this._clip.visible; }
	set visible(v) { this._clip.visible = v;}

	/**
	 * {Boolean} destroy was requested on the GameObject, and will be destroyed
	 * on the next frame. It should be treated as destroyed.
	 */
	/** get destroying() { return this._destroying; }
	set destroying() { this._destroying=true;}*/

	/**
	 * @property {boolean} destroyed
	 */
	get destroyed(){ return this._destroyed }

	/**
	 * @property {DisplayObject} clip - clip of the gameObject. This must be set at the time
	 * of GameObject creation, and cannot be changed.
	 */
	get clip() { return this._clip; }

	/**
	 * 
	 * @param {DisplayObject} [clip=null] 
	 * @param {Point} [pos=null] 
	 */
	constructor( clip=null, pos=null ){

		this._components = [];
		this._compMap = new Map();

		if ( clip !== null ) {

			if ( pos ) clip.position = pos;
			this._position = clip.position;

			this._destroyOpts = {
				children:true,
				texture:false,
				baseTexture:false
			}
		} else {

			this._clip=null;
			this._position = pos || new Point(0,0);
			this._emitter = new PIXI.utils.EventEmitter();

		}

		console.assert( clip !== undefined, 'GameObject: Clip undefined.');

		this._clip = clip;

	}

	/**
	 * 
	 * @param {string} evt 
	 * @param {function} func 
	 * @param {*} [context=null]
	 * @returns {PIXI.utils.EventEmitter}
	 */
	on( evt, func, context=null ) {
		if ( this._clip !== null ) return this._clip.on( evt, func, context );
		else return this._emitter.on( evt, func, context);
	}

	/**
	 * Emit an event through the underlying gameObject clip. If the gameObject
	 * does not contain a clip, the event is emitted through a custom emitter.
	 * @param {*} args - First argument should be the {string} event name.
	 */
	emit( ... args ) {
		if ( this._clip !== null ) this._clip.emit.apply( this._clip, args );
		else this._emitter.emit.apply( this._emitter, args );
	}

	/**
	 * Add an existing component to the GameObject.
	 * @param {Component} inst
	 * @param {?Object} [cls=null]
	 * @returns {Component} Returns the instance.
	 */
	addExisting( inst, cls=null ) {

		this._components.push( inst );
		this._compMap.set( cls || inst._constructor || inst, inst );

		inst._init( this );

		return inst;

	}

	/**
	 * Instantiate and add a component to the GameObject.
	 * @param {class} cls - component class to instantiate.
	 * @returns {Object}
	*/
	add( cls ) {
		return this.addExisting( new cls(), cls );
	}

	/**
	 * Checks if the Object's clip contains a global point.
	 * false for objects without clips or clip.hitAreas.
	 * @param {Vector|Object} pt
	 * @param {number} pt.x
	 * @param {number} pt.y
	 * @returns {boolean}
	 */
	contains( pt ) {

		let clip = this._clip;
		if ( clip === null ) return false;
		if ( !clip.hitArea ) return clip.getBounds().contains( pt.x, pt.y );

		pt = clip.toLocal( pt );
		return clip.hitArea.contains( pt.x, pt.y );
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	translate( x, y ) {
		this._position.x += x;
		this._position.y += y;
	}

	/**
	 * 
	 * @param {*} cls 
	 */
	get( cls ) {

		let inst = this._compMap.get(cls);
		if ( inst !== undefined ) return inst;

		for( let i = this._components.length-1; i>=0; i-- ) {
			if ( this._components[i] instanceof cls ) return this._components[i];
		}
		return null;

	}

	/**
	 * 
	 * @param {*} cls 
	 */
	require( cls ) {

		let inst = this._compMap.get(cls);
		if ( inst !== undefined ) return inst;

		for( let i = this._components.length-1; i>=0; i-- ) {
			if ( this._components[i] instanceof cls ) return this._components[i];
		}
		return this.add(cls);

	}

	/**
	 * Creates a copy of the given component and adds it
	 * to this GameObject.
	 * @param {Component} comp 
	 */
	addCopy( comp ) {

		let copy = Object.assign(
			Object.create( Object.getPrototypeOf(comp)),
			comp );

		return this.addExisting( copy );

	}

	/**
	 * 
	 * @param {number} delta 
	 */
	update( delta ){

		let comps = this._components;
		let comp;
		for( let i = comps.length-1; i>=0; i-- ) {

			comp = comps[i];
			if ( comp._destroyed === true ) {

				quickSplice( comps, i );
				continue;
			}
			if ( comp.sleep !== true && comp.enabled === true && comp.update ) comp.update(delta );

		}

	}


	/**
	 * 
	 * @param {Component} comp - the component to remove from the game object.
	 * @param {bool} [destroy=true] - whether the component should be destroyed.
	 */
	remove( comp, destroy=true){

		if ( destroy === true ) comp._destroy();

		this._compMap.delete( comp.constructor || comp );


		//let ind = this._components.indexOf( comp);
		//if ( ind < 0) return false;

		//this._components.splice(ind, 1);
		//this.components[ind] = this.components[ this.components.length-1];
		//this.components.pop();

		return true;

	}

	show() {
		if ( this._clip === null ) return;
		this._clip.visible = true;
	}
	hide() {

		if ( this._clip === null) return;
		this._clip.visible = false;
	}

	/**
	 * Set options for destroying the PIXI DisplayObject when
	 * the GameObject is destroyed.
	 * @param {boolean} children 
	 * @param {boolean} texture 
	 * @param {boolean} baseTexture 
	 */
	setDestroyOpts( children, texture, baseTexture ) {

		if ( !this._destroyOpts ) this._destroyOpts = {};

		this._destroyOpts.children = children;
		this._destroyOpts.texture = texture;
		this._destroyOpts.baseTexture = baseTexture;

	}

	/**
	 * Call to destroy the game Object.
	 * Do not call _destroy() directly.
	 */
	Destroy() {
		
		this._destroyed = true;

		let comps = this._components;

		for( let i = comps.length-1; i >= 0; i-- ) {
			this.remove( comps[i] );
		}

	}

	/**
	 * destroys all components and then the GameObject itself.
	 */
	_destroy() {

		if ( this._clip ) this._clip.destroy( this._destroyOpts || true );
	
		this._clip = null;

		this._position = null;
		this._emitter = null;
		this._compMap = null;
		this._components = null;

	}

}