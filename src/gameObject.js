import {Point} from 'pixi.js';
import { EventEmitter } from 'events';

export default class GameObject {

	static setGame(v) { this.Game =v;}
	static getGame(){ return this.Game; }

	static getEngine() { return this.Engine;}
	static setEngine(v) { this.Engine = v;}

	get game() { return GameObject.Game; }

	/**
	 * {Number} bit-flags applied to this GameObject.
	 */
	get flags() { return this._flags; }
	set flags(v) { this._flags = v; }

	/**
	 * {string} Name of the GameObject.
	 */
	get name() { return this._name; }
	set name(v){this._name = v;}

	/**
	 * {boolean}
	 */
	get active() { return this._active; }
	set active(v){this._active=v;}


	/**
	 * {Point} Position of the object and Display clip.
	 */
	get position() { return this._position; }
	set position(v) {

		this._position.set( v.x, v.y );

	}

	get x(){ return this._position.x; }
	set x(v) { this._position.x = v;}

	get y() { return this._position.y; }
	set y(v) { this._position.y = v; }

	/**
	 * {Number} Rotation in radians.
	 */
	get rotation() { return this._clip.rotation; }
	set rotation(v) { this._clip.rotation = v; }

	/**
	 * {Boolean} Set the interactivity for the GameObject.
	 * The setting is ignored if the GameObject has no clip.
	 */
	get interactive() { return this._clip ? this._clip.interactive : false; }
	set interactive(v) { if ( this._clip ) this._clip.interactive = v; }

	get emitter() { return this._clip ? this._clip : this._emitter; }
	/**
	 * {Point} returns the orientation vector of this object.
	 */
	get orient() {

		let rads = this.rotation;
		return new Point( Math.cos(rads), Math.sin(rads) );

	}

	get destroyed(){ return this._destroyed; }

	/**
	 * {*} clip of the gameObject. This must be set at the time
	 * of GameObject creation, and cannot be changed.
	 */
	get clip() { return this._clip; }


	constructor( clip=null, pos=null ){

		this.components = [];

		if ( clip ) {

			if ( pos ) clip.position = pos;
			this._position = clip.position;


		} else {

			this._position = pos || new Point(0,0);
			this._emitter = new EventEmitter();

		}

		this._clip = clip;

	}

	on( evt, func, context ) {
		if ( this._clip ) return this._clip.on( evt, func, context );
		else return this._emitter.on( evt, func, context);
	}

	/**
	 * Emit an event through the underlying gameObject clip. If the gameObject
	 * does not contain a clip, the event is emitted through a custom emitter.
	 * @param {*} args - First argument should be the {string} event name.
	 */
	emit( ... args ) {
		if ( this._clip ) this._clip.emit.apply( this._clip, args );
		else this._emitter.emit.apply( this._emitter, args );
	}

	/**
	 * Add an existing component to the GameObject.
	 * @param {Component} inst
	 * @returns {Component} Returns the instance.
	 */
	addExisting( inst ) {

		this.components.push( inst );
		inst._init( this );

		return inst;

	}

	/**
	 * Instantiate and add a component to the GameObject.
	 * @param {class} cls - component class to instantiate. 
	*/
	add( cls ) {

		let comp = new cls();
		this.components.push(comp);

		comp._init( this );

		return comp;

	}

	translate( x, y ) {
		//this.pos.set( this.pos.x + x, this.pos.y + y );
		this._position.x += x;
		this._position.y += y;
		//this.clip.position = this.pos;
	}

	get( cls ) {

		for( let i = this.components.length-1; i>=0; i-- ) {
			if ( this.components[i] instanceof cls ) return this.components[i];
		}
		return null;

	}

	require( cls ) {

		for( let i = this.components.length-1; i>=0; i-- ) {
			if ( this.components[i] instanceof cls ) return this.components[i];
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

		this.components.push( copy );

		console.log( 'const eql? ' + copy.constructor === comp.constructor );
		console.log( 'proto eql? ' + copy.prototype === comp.prototype );

		copy._init();

		return copy;

	}

	update( delta ){

		let comps = this.components;
		let comp;
		for( let i = comps.length-1; i>=0; i-- ) {

			comp = comps[i];
			if ( comp.enabled && comp.update ) comp.update(delta );

		}

	}


	/**
	 * 
	 * @param {Component} comp - the component to remove from the game object.
	 * @param {bool} destroy - whether the component should be destroyed.
	 */
	remove( comp, destroy=true){

		let ind = this.components.indexOf( comp);
		if ( ind < 0) return false;

		if ( destroy ) comp._destroy();

		this.components.splice(ind, 1);
		//this.components[ind] = this.components[ this.components.length-1];
		//this.components.pop();

		return true;

	}

	destroy() {

		this._destroyed = true;
		this.emitter.emit( 'destroyed', this );
		if ( this.clip ) this.clip.destroy( true );

		this._destroy();

	}

	/**
	 * destroys all components and then the GameObject itself.
	 */
	_destroy() {

		let comps = this.components;
		let len = comps.length-1;
		for( let i = len; i >= 0; i-- ) {

			this.remove( comps[i] );
		}

		this.components = null;

	}

}