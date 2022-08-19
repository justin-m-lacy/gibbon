import Component from '../core/component';
import GameObject from '../core/game-object';

/**
 * Not fully developed.
 * Referencing gameObject on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {

	private _attachCount: number = 0;

	constructor() {
		super();
	}

	_init(gameObject: GameObject) {

		super._init(gameObject);

		this._attachCount++;

	}

	_destroy() {

		this._attachCount--;
		if (this._attachCount <= 0) super._destroy();

	}

}