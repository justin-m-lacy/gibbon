import {Point} from 'pixi.js';

export default class GameObject {

	static setGame(v) { this.Game =v;}
	static getGame(){ return this.Game; }

	static getEngine() { return this.Engine;}
	static setEngine(v) { this.Engine = v;}

	/**
	 * {string}
	 */
	get name() { return this._name; }
	set name(v){this._name = v;}

	/**
	 * {boolean}
	 */
	get active() { return this._active; }
	set active(v){this._active=v;}


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
	set rotation(v) {
		this._clip.rotation = v;
	}

	/**
	 * {Point} returns the orientation vector of this object.
	 */
	get orient() {

		let rads = this.rotation;
		return new Point( Math.cos(rads), Math.sin(rads) );

	}

	/**
	 * {*} clip of the gameObject.
	 */
	get clip() { return this._clip; }


	constructor( clip=null, pos=null ){

		this.components = [];

		if ( clip ) {

			if ( pos ) clip.position = pos;
			this._position = clip.position;


		} else {

			this._position = pos || new Point(0,0);
		}

		this._clip = clip;

	}

	/**
	 * Add an existing component to the GameObject.
	 * @param {*} inst
	 * @returns {*} Returns the instance.
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

		this.components[ind] = this.components[ this.components.length-1];
		this.components.pop();

		return true;

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