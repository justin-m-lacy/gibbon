/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {

	/**
	 *
	 * @param {Gibbon.Game} game
	 */
	constructor( game ) {

		this.game = game;
		this.engine = game.engine;
		this.viewRect = game.screen;

		this.builds = new Map();

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