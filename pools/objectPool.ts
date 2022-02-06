import GameObject from "../src/gameObject";

/**
 * Pool optimized for GameObjects.
 */
export default class ObjectPool {

	constructor() {

		this._objs = [];

	}

	/**
	 * 
	 * @param {GameObject} obj 
	 */
	add( obj ) {

		this._objs.push(obj);

	}

	/**
	 * 
	 * @param {DisplayObject} [clip=null] 
	 * @param {PIXI.Point} [pos=null]
	 * @returns {GameObject}
	 */
	get( clip=null, pos=null ) {

		if ( this._objs.length === 0 ) return new GameObject(clip,pos);

		let obj = this._objs.pop();
		obj._reset( clip, pos );

		return obj;

	}


}