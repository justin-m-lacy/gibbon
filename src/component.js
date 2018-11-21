export default class Component {

	/**
	 * {GameObject} - Game object containing this component.
	 */
	get gameObject() { return this._gameObject; }

	/**
	 * {boolean}
	 */
	get enabled(){ return this._enabled;}
	set enabled(v) { this._enabled = v;}

	/**
	 * Convenience accessor for GameObject clip.
	 */
	get clip() { return this._clip; }

	constructor(){
	}

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
	 * calls destroy() and cleans up any variables.
	 */
	_destroy(){

		if ( this.destroy ) this._destroy();
		this._gameObject = null;

	}

}