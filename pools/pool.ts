export default class Pool {

	private _byType: Map<any, any>;

	constructor() {

		this._byType = new Map();

	}

	/**
	 * Return an object of the keyed type.
	 * @param {*} key
	 * @param {function} object creation function.
	 * @returns {*} Object from pool, or created object.
	 */
	get(key, creator) {

		const list = this.getList(key);
		if (list.length > 0) return list.pop();
		return creator();

	}

	/**
	 * Add an object to the keyed pool.
	 * @param {*} key 
	 * @param {*} obj
	 * @returns {Pool} this 
	 */
	add(key, obj) {
		this.getList(key).push(obj);
		return this;
	}

	/**
	 * 
	 * @param {*} key 
	 */
	getList(key) {

		let list = this._byType.get(key);
		if (list) return list;

		list = [];
		this._byType.set(key, list);
		return list;

	}

}