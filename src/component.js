import GameObject from "./gameObject";

export default class Component {

	get game() { return GameObject.Game; }

	/**
	 * {Number} Convenience accessor for GameObject.flags.
	 */
	get flags() { return this._gameObject.flags; }
	set flags(v) { this._gameObject.flags = v; }

	/**
	 * {GameObject} - Game object containing this component.
	 */
	get gameObject() { return this._gameObject; }

	/**
	 * {Boolean} Whether the component is enabled.
	 */
	get enabled(){ return this._enabled;}
	set enabled(v) { this._enabled = v;}

	get x() { return this._clip.x; }
	set x(v) { this._clip.x = v;}

	get y() { return this._clip.y; }
	set y(v) { this._clip.y = v;}

	get rotation() { return this._clip.rotation; }
	set rotation(v) {

		if ( v > Math.PI ) v-= 2*Math.PI;
		else if ( v < -Math.PI) v += 2*Math.PI;

		this._clip.rotation = v;
	}

	get position() { return this._gameObject.position; }
	set position(v) {
		this._gameObject.position = v;
	}

	/**
	 * {DisplayObject} Convenience accessor for GameObject clip.
	 */
	get clip() { return this._clip; }

	get destroyed() { return this._destroyed; }

	constructor(){}

	/**
	 * Override init() in subclass.
	 */
	init(){}

	_init( gameObject ) {

		this._gameObject = gameObject;
		this._clip = this._gameObject.clip;

		this._enabled = true;

		this.init();

	}

	/**
	 * 
	 * @param {class} cls - class to add to the component's game object.
	 */
	add( cls ) {
		return this._gameObject.add( cls );
	}

	/**
	 * Add a component already instantiated.
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addExisting( comp ) {
		return this._gameObject.addExisting(comp);
	}

	/**
	 * 
	 * @param {class} cls - wrapper for gameObject get() 
	 */
	get(cls) { return this._gameObject.get(cls);}

	/**
	 * Wraps GameObject require().
	 * @param {*} cls 
	 */
	require(cls) { return this._gameObject.require(cls); }

	/**
	 * Use to destroy a Component.
	 * Do not call _destroy() or destroy() directly.
	 */
	Destroy() {
		this._destroy();
	}

	/**
	 * calls destroy() and cleans up any variables.
	 */
	_destroy(){

		if ( this.destroy ) this.destroy();
		this._enabled = false;
		this._destroyed = true;
		this._clip = null;
		this._gameObject = null;

	}

}