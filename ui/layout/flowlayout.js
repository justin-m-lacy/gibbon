import {Flow } from '../ui.js';

export default class FlowLayout {

	get flow() { return this._flow; }
	set flow(v) { this._flow =v; }

	get padding() { return this._padding; }
	set padding(v) { this._padding = v;}

	constructor( flow, padding=4 ){

		this._flow = flow || Flow.HORIZONTAL;
		this._padding = padding;

	}

	arrange( container ) {

		let padding = container.padding || this.padding || 0;
		let children = container.children;
		let len = children.length;
		let clip, prop,sizeProp;
	
		if ( this._flow === Flow.HORIZONTAL ) {
			prop = 'x';
			sizeProp='width';
		} else {
			prop = 'y';
			sizeProp = 'height';
		}

		let v = padding;

		for( let i = 0; i < len; i++ ) {

			clip = children[i];
			if ( clip.visible === false ) continue;

			clip[prop] = v;
			v += padding + clip[sizeProp];

		}

	}

}