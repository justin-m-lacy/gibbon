export default class Library {

	constructor(){
		this._lib = {};
	}

	/**
	 * 
	 * @param {*} name 
	 * @param {Object|function} item - function(position) to create an object,
	 * an Object with a clone() function, or a plain object to return.
	 */
	addItem( name, item ) {
		this._lib[name] = item;
	}

	/**
	 * 
	 * @param {*} name 
	 * @param {Point|Object} [p=null] - point to place instance.
	 * @returns {*} Object created, or null.
	 */
	instance( name, p=null) {

		let item = this._lib[name];
		if ( !item ) return null;

		let type = typeof( item );
		if ( type === 'function') {
			// creation function.
			item = type( p );
			return item;

		} else if ( item.clone ) return item.clone();
		else return item;


	}

}