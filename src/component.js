import GameObject from "./gameObject";

export default class Component {

	/**
	 * @property {Game} game
	 */
	get game() { return GameObject.Game; }

	/**
	 * @property {Engine} engine
	 */
	get engine() { return GameObject.Engine; }

	/**
	 * @property {number} flags - Convenience accessor for GameObject.flags.
	 */
	get flags() { return this._gameObject.flags; }
	set flags(v) { this._gameObject.flags = v; }

	/**
	 * @property {GameObject} - Game object containing this component.
	 */
	get gameObject() { return this._gameObject; }

	/**
	 * @property {Group} group - Group controlling the component's GameObject, if any.
	 */
	get group() { return this._gameObject._group; }

	/**
	 * @property {boolean} enabled - Whether the component is enabled.
	 */
	get enabled(){ return this._enabled;}
	set enabled(v) {

		this._enabled = v;

		if ( v=== true ) {
			if ( this.onEnable) this.onEnable();
		} else {
			if ( this.onDisable) this.onDisable();
		}

	}

	/**
	 * @property {number} x
	 */
	get x() { return this._clip.x; }
	set x(v) { this._clip.x = v;}

	/**
	 * @property {number} y
	*/
	get y() { return this._clip.y; }
	set y(v) { this._clip.y = v;}

	/**
	* @property {number} rotation - underlying clip rotation in radians.
	*/
	get rotation() { return this._clip.rotation; }
	set rotation(v) {

		if ( v > Math.PI ) v-= 2*Math.PI;
		else if ( v < -Math.PI) v += 2*Math.PI;

		this._clip.rotation = v;
	}

	/**
	 * @property {PIXI.Point} position
	 */
	get position() { return this._gameObject.position; }
	set position(v) {
		this._gameObject.position = v;
	}

	/**
	 * @property {DisplayObject} clip - Convenience accessor for GameObject clip.
	 */
	get clip() { return this._clip; }

	/**
	 * Indicates the component has been marked for disposal and should no longer
	 * be referenced.
	 * @property {Boolean} destroyed
	 */
	get destroyed() { return this._destroyed; }

	/**
	 * Constructor intentionally empty so components can be
	 * instantiated by user and added to GameObjects without
	 * knowledge of the underlying game system.
	 * @note component properties such as gameObject, clip, and game,
	 * are not available in component constructor.
	 */
	constructor(){}

	/**
	 * Override in subclass to initialize component.
	 * Basic component properties now available.
	 */
	init(){}

	/**
	 * Private initializer calls subclass init()
	 * @param {GameObject} gameObject
	 */
	_init( gameObject ) {

		this._gameObject = gameObject;
		this._clip = this._gameObject.clip;

		this._enabled = true;

		this.init();

	}

	/**
	 *
	 * @param {class} cls - class to add to the component's game object.
	 * @returns {Component}
	 */
	add( cls ) {
		return this._gameObject.add( cls );
	}

	/**
	 * Add a component already instantiated. Wraps gameObject.addExisting()
	 * @param {Component} comp
	 * @returns {Component} The added component instance.
	 */
	addExisting( comp, cls ) {
		return this._gameObject.addExisting(comp, cls );
	}

	/**
	 *
	 * @param {class} cls - wrapper for gameObject get()
	 * @returns {Component|null}
	 */
	get(cls) { return this._gameObject.get(cls);}

	/**
	 * Wraps GameObject require().
	 * @param {*} cls
	 * @returns {Component}
	 */
	require(cls) { return this._gameObject.require(cls); }

	/**
	 * Use to destroy a Component.
	 * override destroy() to clean up your components.
	 * Do not call _destroy() or destroy() directly.
	 */
	Destroy() { this._destroy(); }

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