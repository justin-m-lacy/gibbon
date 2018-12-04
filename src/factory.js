/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {

	constructor( game ) {

		this.game = game;
		this.engine = game.engine;
		this.viewRect = game.screen;

		this.builds = {};

	}

	/**
	 * Associates a key with the given creator function, binding it to this factory
	 * instance.
	 * @param {string} key 
	 * @param {Function} func 
	 */
	addCreator( key, func ) {
		this.builds[key] = func;
	}

	/**
	 * Create a GameObject from the given key.
	 * @param {string} key 
	 */
	create( key, ...args ){
		let build = this.builds[key];
		if ( !build ) return null;

		return build.apply( this, args );

	}

}