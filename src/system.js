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
	 */
	constructor( game, clip=null ){

		super( game, clip );

	}

	pause(){

		if ( this.enabled){
			this.game.removeUpdater(this);
		}
		super.pause();

	}

	unpause(){

		if ( this.enabled ) {
			this.start();
		}
		super.unpause();

	}

	start(){
		this._enabled = true;

		if ( !this.paused ) {
			this.game.addUpdater(this);
		}

	}

	stop(){

		this._enabled = false;
		this.game.removeUpdater(this);

	}

	update(delta ) {
	}

}