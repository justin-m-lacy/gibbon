import Component from "../src/component";
import { quickSplice } from "../utils/arrayutils";

export default class SleepSystem extends Component {

	/**
	 * {Number} - frames between sleep/unsleep checks.
	 */
	get checkTime() { return this._checkTime; }
	set checkTime(v) { this._checkTime = v;}

	/**
	 * {Number} distance offscreen at which object is hidden.
	 */
	get hideDist() { return this._hideDist; }
	set hideDist(v) { this._hideDist =v; }

	/**
	 * {Number} distance at which object is slept.
	 */
	get sleepDist() { return this._sleepDist; }
	set sleepDist(v) { this._sleepDist = v; }

	constructor( hideDist=128, sleepDist=256, checkTime=12 ){

		this._hideDist = hideDist;
		this._sleepDist = sleepDist;
		this._checkTime = checkTime;

		this._sleepers = [];
		this._time = this._checkTime;

	}

	init() {

		this._engine = this.game.engine;
		this._view = this.game.camera.viewRect;

	}

	update( delta ) {

		var obj, pos, del, objects = this._sleepers;
		let rect = this._view;

		for( let i = objects.length-1; i >= 0; i-- ) {

			obj = objects[i];
			pos = obj.pos;

			del = Math.max( rect.x - pos.x, pos.x - rect.right, pos.y - rect.bottom, rect.top - pos.y );
			if ( del < this._sleepDist ) {

				obj.sleep = false;

				if ( del < this._hideDist ) {
					obj.visible = true;
					quickSplice( objects, i );
				}

			}

		}

		this._time -= delta;
		if ( this._time <= 0 ) {

			objects = this._engine.objects;
			this._time = this._checkTime;

			for( let i = objects.length-1; i >= 0; i--) {

				obj = objects[i];
				// already handled by other loop, plus hidden objects shouldnt be hidden.
				if ( obj.sleep === true || obj.visible === false ) continue;
				pos = obj.pos;

				del = Math.max( rect.x - pos.x, pos.x - rect.right, pos.y - rect.bottom, rect.top - pos.y );
				if ( del > this._hideDist) {

					obj.visible = false;
					if ( del > this._sleepDist) {

						this._sleepers.push(obj);
						obj.sleep = true;

					}
				}

			} // for-loop.

		}

	}

}