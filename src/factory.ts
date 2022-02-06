/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {

	/**
	 * @property {PIXI.renderer} renderer - game renderer to pre-render objects to textures.
	 */
	get renderer(){return this._game.renderer;}

	/**
	 * @property {Gibbon.Game} game
	 */
	get game(){return this._game; }

	/**
	 * @property {Gibbon.Engine} engine
	 */
	get engine(){ return this.game.engine;}

	/**
	 * @property {PIXI.Rectangle} viewRect
	 */
	get viewRect(){ return this._viewRect;}

	/**
	 * @property {Map.<string,function>} builds
	 */
	get builds(){ return this._builds;}

	/**
	 *
	 * @param {Gibbon.Game} game
	 */
	constructor( game ) {

		this._game = game;
		this._engine = game.engine;
		this._viewRect = game.screen;

		this._builds = new Map();

	}

	/**
	 * Associates a key with the given creator function, binding it to this factory
	 * instance.
	 * @param {string} key
	 * @param {Function} func
	 * @param {?object} data - data to pass as first argument to create function.
	 * @returns {Factory} this.
	 */
	addCreator( key, func, data ) {

		if ( data ) func = func.bind( this, data );

		this.builds.set( key, func );
		return this;
	}

	/**
	 * Create a GameObject from the given key.
	 * @param {string} key
	 * @returns {GameObject} Object created.
	 */
	create( key, ...args ){

		let build = this.builds.get( key );
		if ( !build ) return null;

		return build.apply( this, args );

	}

}