/**
 * A Factory creates full GameObject instances from keys.
 */
export default class Factory {

	constructor( game ) {

		this.game = game;
		this.engine = game.engine;
		this.screen = game.screen;

		this.builds = {};

	}

	/**
	 * Associates a key with the given creator function, binding it to this factory
	 * instance.
	 * @param {string} key 
	 * @param {Function} func 
	 */
	addCreator( key, func ) {
		this.builds[key] = func.bind( this );
	}

	/**
	 * Create a GameObject from the given key.
	 * @param {string} key 
	 * @param {Point} [loc=null] 
	 */
	create( key, loc=null){
		let build = this.builds[key];
		if ( !build ) return null;
		return build( loc );

	}

}