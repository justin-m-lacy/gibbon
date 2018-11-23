export default class System {

	get game() { return this._game;}
	set game(v) { this._game = v;}

	get enabled() { return this._enabled; }
	set enabled(v) { this._enabled =v;}

	constructor(game){

		this.game = game;


	}

	start(){
		this._enabled = true;
	}
	stop(){
		this._enabled = false;
	}

	update(delta ) {
	}

}