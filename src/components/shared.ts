import { Component } from '../core/component';
import type { Actor } from '../core/actor';

/**
 * Not fully developed.
 * Referencing actor on SharedComponent is not currently safe.
 */
export class SharedComponent extends Component {

	private _attachCount: number = 0;

	constructor() {
		super();
		throw Error("Not implemented.");
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