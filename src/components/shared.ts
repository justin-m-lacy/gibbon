import Component from '../core/component';
import Actor from '../core/actor';

/**
 * Not fully developed.
 * Referencing gameObject on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {

	private _attachCount: number = 0;

	constructor() {
		super();
	}

	_init(gameObject: Actor) {

		super._init(gameObject);

		this._attachCount++;

	}

	_destroy() {

		this._attachCount--;
		if (this._attachCount <= 0) super._destroy();

	}

}