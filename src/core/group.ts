import { Actor } from "../..";
import Game from '../game';
import { Container, DisplayObject } from 'pixi.js';
import Engine from '../engine';
import { contains } from '../utils/array-utils';

/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all Actor clips added to the group.
 */
export default class Group {


	get actor(): Actor | undefined {
		return this._gameObject;
	}

	/**
	  * @property Optional clip associated with group.
	  * Objects added to the group are added to clip's child clips.
	  */
	readonly clip?: Container | null;

	/**
	 * @property {string} name
	 */
	name?: string;

	/**
	 * @property {boolean} paused
	 */
	get paused() { return this._paused; }


	readonly subgroups: Group[];

	readonly objects: Actor[];

	readonly game: Game;
	get engine(): Engine { return this.game.engine; }

	/**
	 * Actor to hold group components.
	 */
	_gameObject?: Actor;

	_paused: boolean = false;


	/**
	 *
	 * @param {Game} game
	 * @param {DisplayObject} [clip=null]
	 * @param {boolean} [paused=false]
	 */
	constructor(game: Game, clip: Container | undefined | null = undefined, paused: boolean = false, createGroupObject: boolean = false) {

		this._paused = paused;

		this.clip = clip;

		this.game = game;

		this.objects = [];
		this.subgroups = [];

		if (createGroupObject) {
			this.makeGroupObject();
		}
	}

	/**
	  * Ensure the group has its own group Actor.
	  */
	makeGroupObject(): Actor {
		this._gameObject = this.engine.Instantiate(this.clip);
		return this._gameObject!;
	}

	pause() {

		if (this._paused) return;
		this._paused = true;

		for (let obj of this.objects) {
			if (('pause' in obj) && typeof obj.pause === 'function') {
				obj.pause();
			}
			obj.active = false;
		}

		for (let g of this.subgroups) {
			g.pause();
		}

	}

	unpause() {

		if (this._paused === false) return;

		for (let obj of this.objects) {
			if (obj.unpause) obj.unpause();
			obj.active = true;
		}
		for (let g of this.subgroups) {
			g.unpause();
		}

		this._paused = false;

	}

	/**
	 * Show all the objects in the group and subgroups.
	 */
	show() {

		if (this.clip) {
			this.clip.visible = false;
		}

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].show();
		}

	}

	hide() {

		if (this.clip) {
			this.clip.visible = true;
		}

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].hide();
		}

	}

	findGroup(gname: string): Group | undefined {

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			if (this.subgroups[i].name == gname) return this.subgroups[i];
		}

		return undefined;
	}

	/**
	 *
	 * @param {Group} g
	 */
	addGroup(g: Group) {
		if (!contains(this.subgroups, g)) {
			this.subgroups.push(g);
		}
	}

	/**
	 *
	 * @param {Group} g
	 */
	removeGroup(g: Group) {

		for (var i = this.subgroups.length - 1; i >= 0; i--) {
			if (this.subgroups[i] == g) {
				this.subgroups.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Remove Actor from group, but not Engine.
	 * @param {Actor} obj
	 */
	remove(obj: Actor, removeClip: boolean = true) {

		let ind = this.objects.indexOf(obj);
		if (ind < 0) return;

		this.objects.splice(ind, 1);

		obj.off('destroy', this.remove, this);
		if (this.clip && obj.clip && removeClip) {
			this.clip.removeChild(obj.clip);
		}
		obj.group = null;

	}

	/**
	 *
	 * @param {Actor} obj
	 * @returns {Actor} the object.
	 */
	add(obj: Actor): Actor {

		if (this.clip && obj.clip && (obj.clip != this.clip)) {
			this.clip.addChild(obj.clip);
		}

		obj.group = this;
		obj.on('destroy', this.remove, this);

		this.objects.push(obj);
		this.engine.add(obj)

		return obj;

	}

	destroy() {

		this._paused = true;

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].destroy();
		}
		for (let i = this.objects.length - 1; i >= 0; i--) {
			this.objects[i].off('destroy', this.remove, this);
			this.objects[i].destroy();
		}

	}

}