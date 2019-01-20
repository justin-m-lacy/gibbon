import { Container } from "pixi.js";
import * as PIXI from 'pixi.js';

export default class ProgressBar extends Container {

	get loader() { return this._loader; }

	/**
	 * {number}
	 */
	get progress() { return this._loader ? this._loader.progress : 0; }

	/**
	 * {Boolean}
	 */
	get loading() { return this._loader && this._loading === true; }

	/**
	 * {Boolean}
	 */
	get complete() { return this._complete; }

	constructor( back, bar ) {

		super();

		this.back = back;
		this.bar = bar;

		console.assert( back && bar, 'back or bar null: ' + back + ', ' + bar );

		bar.x = back.x+2;
		bar.y = ( back.height - bar.height)/2;

		this.addChild( back );
		this.addChild( bar );

		this._loading = false;
		this._complete = false;

	}

	updateProgress( delta ) {

		if ( !this._loader ) this.stop();
		else if ( this._loader.progress === 1 ) {

			this._complete = true;
			this._loading = false;

		} else {

			this.bar.scale.x += ( this._loader.progress - this.bar.scale.x )/8;

		}

	}

	watch( loader ) {

		this._loader = loader;
		this.bar.scale.x = loader.progress;
		this._loading = true;
		this._complete = false;

		PIXI.ticker.shared.add( this.updateProgress, this );

	}

	complete() {

		PIXI.ticker.shared.remove( this.updateProgress, this );
		this._complete = true;
		this._loading = false;

	}

	stop() {

		PIXI.ticker.shared.remove( this.updateProgress, this );
		this._loading = false;
		this._complete = false;
		this._loader = null;

	}

}