import { Component } from "../core/component";
import { quickSplice } from "../utils/array-utils";
import type { Actor } from '../core/actor';
import type { Engine } from '../engine';

export class SleepSystem extends Component {

	/**
	 * @property {number} _checkTimeFrames - frames between sleep/unsleep checks.
	 */
	private _checkTimeFrames: number;

	/**
	 * @property {number} sleepDist - distance at which object is slept.
	 */
	private _sleepDist: number;

	/**
	 * @property {number} hideDist - distance offscreen at which object is hidden.
	 */
	private _hideDist: number;

	private readonly _sleepers: Actor[] = [];

	private _countdown: number;

	_engine?: Engine;

	/**
	 *
	 * @param {number} hideDist - distance offscreen at which object should hide.
	 * @param {number} sleepDist - distance offscreen at which object should sleep.
	 * @param {number} checkTimeFrames - number of frames between sleep checks.
	 */
	constructor(hideDist: number = 128, sleepDist: number = 256, checkTimeFrames: number = 12) {

		super();

		this._hideDist = hideDist;
		this._sleepDist = sleepDist;
		this._checkTimeFrames = checkTimeFrames;

		this._sleepers = [];
		this._countdown = this._checkTimeFrames;

	}

	init() {

		this._engine = this.game.engine;

	}

	update(delta: number) {

		let del;
		let objects = this._sleepers;
		const rect = this.game.camera?.viewRect;

		if (rect == null) {
			return;
		}

		for (let i = objects.length - 1; i >= 0; i--) {

			const obj = objects[i];
			const pos = obj.position;

			del = Math.max(rect.x - pos.x, pos.x - rect.right, pos.y - rect.bottom, rect.top - pos.y);
			if (del < this._sleepDist) {

				obj.sleep = false;

				if (del < this._hideDist) {
					obj.visible = true;
					quickSplice(objects, i);
				}

			}

		}

		this._countdown -= delta;
		if (this._countdown <= 0) {

			objects = this._engine!.objects;
			this._countdown = this._checkTimeFrames;

			for (let i = objects.length - 1; i >= 0; i--) {

				const obj = objects[i];
				// already handled by other loop, plus hidden objects shouldnt be hidden.
				if (obj.sleep === true || obj.visible === false) continue;
				const pos = obj.position;

				del = Math.max(rect.x - pos.x, pos.x - rect.right, pos.y - rect.bottom, rect.top - pos.y);
				if (del > this._hideDist) {

					obj.visible = false;
					if (del > this._sleepDist) {

						this._sleepers.push(obj);
						obj.sleep = true;

					}
				}

			} // for-loop.

		}

	}

}