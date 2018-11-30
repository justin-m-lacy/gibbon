import Component from "../src/component";

export default class SpriteTiler extends Component {

	get target() { return this._target;}
	set target(v) {
		this._target=v;
		if ( v ) this.sprite.tilePosition.set( -v.position.x, -v.position.y );
	}

	constructor( tilingSprite=null ){

		super();
		this.sprite = tilingSprite;

	}

	init(){

		if ( !this.sprite ) this.sprite = this.gameObject.clip;

	}

	update(delta) {

		if ( !this._target ) return;
		let pos = this._target.position;

		this.sprite.tilePosition.set( -pos.x, -pos.y );

	}

}