import GameObject from "../src/gameObject";

/**
 * Pool optimized for GameObjects.
 */
export default class ObjectPool {

	constructor() {

		this._objs = [];

	}

	add( obj ) {

		this._objs.push(obj);

	}

	get( clip=null, pos=null ) {

		if ( this._objs.length === 0 ) return new GameObject(clip,pos);

		let obj = this._objs.pop();
		obj._reset( clip, pos );

		return obj;

	}


}