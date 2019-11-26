import Group from "./group";

export default class System extends Group {

	/**
	 * @property {boolean} enabled
	 */
	get enabled() { return this._enabled; }
	set enabled(v) { this._enabled =v;}

	/**
	 *
	 * @param {Game} game
	 * @param {GameObject} clip - system container clip.
	 * @param {boolean} [enabled=false] - whether to start System immediately.
	 */
	constructor( game, clip=null, enabled=false ){

		super( game, clip );

		if ( enabled === true ) this.start();

	}

	start(){

		if ( !this._enabled ) {
			this.game.addUpdater(this);
		}
		this._enabled = true;

	}

	stop(){

		if ( this._enabled === true ) {
			this.game.removeUpdater(this);
		}
		this._enabled = false;

	}

	pause(){

		if ( this.enabled){ this.stop(); }
		super.pause();

	}

	unpause(){

		if ( this.enabled ) { this.start(); }
		super.unpause();

	}

	destroy(){
		this.stop();
		super.destroy();
	}

	/**
	 * Override in subclass.
	 */
	update() {}

}