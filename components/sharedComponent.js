import Component from '../src/component';

export default class SharedComponent extends Component {

	constructor() {

		super();

		this._attachCount = 0;

	}

	_init( gameObject ) {

		super._init(gameObject);

		this._attachCount++;

	}

	_destroy(){

		this._attachCount--;
		if ( this._attachCount <= 0 ) super._destroy();

	}

}