import Component from '../core/component';
import Actor from '../core/actor';

/**
 * Not fully developed.
 * Referencing actor on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {

	private _attachCount: number = 0;

	constructor() {
		super();
	}

	_init(actor: Actor) {

		super._init(actor);

		this._attachCount++;

	}

	_destroy() {

		this._attachCount--;
		if (this._attachCount <= 0) super._destroy();

	}

}