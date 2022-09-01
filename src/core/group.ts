import { Actor } from "../..";
import type { Game } from '../game';
import type { Container } from 'pixi.js';
import { contains } from '../utils/array-utils';

/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all Actor clips added to the group.
 */
export class Group<T extends Game = Game> {


	get actor(): Actor | undefined {
		return this._actor;
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


	/**
	 * Subgroups of this group.
	 */
	readonly subgroups: Group<T>[] = [];

	/**
	 * Objects in group.
	 */
	readonly objects: Actor[] = [];

	/**
	 * Actor to hold group components.
	 */
	_actor?: Actor;

	_paused: boolean = false;

	private _game?: T;
	/**
	 * Game group is added to, if any.
	 */
	public get game() { return this._game }

	/**
	 * Parent group, if any.
	 */
	private _parent?: Group;

	/**
	 *
	 * @param {DisplayObject} [clip=null]
	 * @param {boolean} [paused=false]
	 */
	constructor(clip: Container | undefined | null = undefined, paused: boolean = false, createGroupObject: boolean = false) {

		this._paused = paused;

		this.clip = clip;

		if (createGroupObject) {
			this.makeGroupObject();
		}
	}

	/**
	  * Ensure the group has its own group Actor.
	  */
	makeGroupObject(): Actor {
		this._actor = new Actor(this.clip ?? undefined);
		return this._actor;
	}

	pause() {

		if (this._paused) return;
		this._paused = true;

		for (const obj of this.objects) {
			if (('pause' in obj) && typeof obj.pause === 'function') {
				obj.pause();
			}
			obj.active = false;
		}

		for (const g of this.subgroups) {
			g.pause();
		}

	}

	unpause() {

		if (this._paused === false) return;

		for (const obj of this.objects) {
			if (obj.unpause) obj.unpause();
			obj.active = true;
		}
		for (const g of this.subgroups) {
			g.unpause();
		}

		this._paused = false;

	}

	/**
	 * Override in subclasses for notification of when
	 * group is added to game.
	 */
	onAdded() {
	}

	/**
	 * Override in subclasses to be notified when group is removed.
	 */
	onRemoved() {
	}

	/**
	 * Internal message of group being added to game.
	 * Do not call directly.
	 * Override onAdded() in subclasses for the event.
	 */
	_onAdded(game: T) {

		if (this._game !== game) {

			this._game = game;
			this.onAdded();

			for (const g of this.subgroups) {
				g._onAdded(game);
			}

		}

	}

	/**
	 * Internal message of group being removed from game.
	 * Do not call directly.
	 * Override onRemoved() in subclasses for the event.
	 */
	_onRemoved() {

		if (this._game === undefined) {
			/// not added to any game.
			return;
		}

		this.onRemoved();

		this._game = undefined;
		for (const g of this.subgroups) {
			g._onRemoved();
		}


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

	/**
	 * Hide all actors in this group and subgroups.
	 */
	hide() {

		if (this.clip) {
			this.clip.visible = true;
		}

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].hide();
		}

	}

	/**
	 * Find subgroup of this group.
	 * @param gname 
	 * @returns 
	 */
	findGroup(gname: string): Group | undefined {

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			if (this.subgroups[i].name == gname) return this.subgroups[i];
		}

		return undefined;
	}

	/**
	 * Add subgroup to this group.
	 * @param {Group} g
	 */
	addGroup(g: Group<T>) {

		if (g._parent) {

			if (g._parent === this) {
				return;
			}
			g._parent.removeGroup(g);
		}

		g._parent = this;
		if (!contains(this.subgroups, g)) {
			this.subgroups.push(g);
		}
	}

	/**
	 * Remove subgroup from this group.
	 * @param {Group} g
	 */
	removeGroup(g: Group) {

		if (g._parent !== this) {
			return;
		}
		g._parent = undefined;

		for (let i = this.subgroups.length - 1; i >= 0; i--) {

			if (this.subgroups[i] == g) {
				this.subgroups.splice(i, 1);

				g.onRemoved();

				return;
			}
		}
	}

	/**
	 * Remove Actor from group, but not Game or Engine.
	 * @param {Actor} obj
	 */
	remove(obj: Actor, removeClip: boolean = true) {

		const ind = this.objects.indexOf(obj);
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
		this._game?.engine.add(obj);

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

		this._game = undefined;

	}

}