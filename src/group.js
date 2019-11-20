/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all GameObject clips added to the group.
 */
export default class Group {

	/**
	 * @property {DisplayObject} clip - clip associated with group, if any.
	 * Objects added to the group are added to clip's child clips.
	 */
	get clip() { return this._clip; }

	/**
	 * @property {string} name
	 */
	get name() { return this._name; }
	set name(v) { this._name =v;}

	/**
	 * @property {GameObject[]} objects
	 */
	get objects() { return this._objects; }

	/**
	 * @property {Game} game
	 */
	get game() { return this._game;}

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this._engine;}

	/**
	 * @property {boolean} paused
	 */
	get paused() { return this._paused; }

	/**
	 * @property {Group[]} [subgroups=undefined]
	 */
	get subgroups() { return this._subgroups; }

	/**
	 *
	 * @param {Game} game
	 * @param {DisplayObject} [clip=null]
	 */
	constructor( game, clip=null ) {

		this._paused = false;

		this._clip = clip;

		this._game = game;
		this._engine = game.engine;

		this._objects = [];

	}

	pause() {

		if ( this._paused ) return;
		this._paused = true;

		for( let obj of this._objects ) {
			obj.pause();
		}
		for( let g of this._subgroups ) {
			g.pause();
		}

	}

	unpause() {

		if ( this._paused === false ) return;

		for( let obj of this._objects ) {
			obj.unpause();
		}
		for( let g of this._subgroups ) {
			g.unpause();
		}

		this._paused = false;

	}

	/**
	 * Show all the objects in the group and subgroups.
	 */
	show() {

		if ( this._clip ) this._clip.visible = false;

		if ( this.subgroups ) {
			for( let i = this.subgroups.length-1; i>=0; i-- ) {
				this.subgroups[i].show();
			}

		}

	}

	hide() {

		if ( this._clip ) this._clip.visible = true;

		if ( this.subgroups ) {
			for( let i = this.subgroups.length-1; i>=0; i-- ) {
				this.subgroups[i].hide();
			}

		}

	}

	/**
	 *
	 * @param {string} gname
	 */
	findGroup( gname ) {

		if ( !this._subgroups ) return null;

		for( let i = subgroups.length-1; i >= 0; i-- ) {
			if ( this.subgroups[i].name == gname ) return subgroups[i];
		}

		return null;
	}

	/**
	 *
	 * @param {Group} g
	 */
	addGroup( g ) {

		if ( !this._subgroups ) this._subgroups = [];
		this._subgroups.push(g);

	}

	/**
	 *
	 * @param {Group} g
	 */
	removeGroup( g ) {

		if ( !this._subgroups ) return;

		for( var i = this._subgroups.length-1; i>= 0; i-- ) {
			if ( this._subgroups[i] == g ){
				this._subgroups.splice(i,1 );
				return;
			}
		}
	}

	/**
	 * Add a PIXI DisplayObject as a child of the group's clip.
	 * Not recommended for production use, but for quick prototyping
	 * without using full GameObjects.
	 * @param {DisplayObject} clip
	 */
	addChild( clip ) {
		if ( this._clip ) this._clip.addChild( clip );
	}

	/**
	 *
	 * @param {GameObject} obj
	 */
	add( obj ) {

		if ( this._clip && obj.clip ) this._clip.addChild( obj.clip );

		obj.group = this;
		this._objects.push( obj );
		this._engine.add( obj )

	}

	destroy() {

		this._paused = true;
		for( let i = this._objects.length-1; i>= 0; i-- ) {
			this._objects[i].Destroy();
		}

		if ( this._subgroups ) {

			for( let i = this._subgroups.length-1; i>= 0; i-- ) {
				this._subgroups[i].destroy();
			}
		}

		this._engine = null;
		this._clip = null;
		this._game = null;
		this._subgroups = null;
		this._objects = null;

	}

}