import { Actor } from "../..";
import type { Game } from '../game';
import type { Container } from 'pixi.js';
import { contains } from '../utils/array-utils';
import { EngineEvent } from '../events/engine-events';
import { Constructor } from '../utils/types';

/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all Actor clips added to the group.
 */
export class Group<T extends Game = Game> {


	get actor() {
		return this._actor;
	}

	/**
	  * @property Optional clip associated with group.
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
	readonly subgroups: Group[] = [];

	/**
	 * Objects in group.
	 */
	readonly objects: Actor[] = [];

	/**
	 * Actor to hold group components.
	 */
	private readonly _actor?: Actor<Container>;

	_paused: boolean = false;

	private _game?: T;
	/**
	 * Game group is added to, if any.
	 */
	public get game() { return this._game }

	get parent() { return this._parent }

	/**
	 * Parent group, if any.
	 */
	private _parent?: Group;

	protected isDestroyed: boolean = false;

	/**
	 *
	 * @param actor -actor to assign to group, or container to use as group container,
	 * or 'true' to create a group container.
	 * @param paused
	 */
	constructor(actor?: Container | boolean | undefined | null, paused: boolean = false) {

		this._paused = paused;
		if (actor) {
			this._actor = this.makeGroupActor(actor);
			this.clip = this._actor.clip;
		}

	}

	/**
	  * Ensure the group has its own group Actor.
	  */
	private makeGroupActor(clip: Actor<Container> | Container | boolean): Actor<Container> {

		let actor: Actor<Container>;
		if (typeof clip === 'boolean') {
			actor = new Actor<Container>();
		} else if (clip instanceof Actor) {
			actor = clip;
		} else {
			actor = new Actor<Container>(clip);
		}

		if (this._game) {
			this._game.addActor(actor);
		}
		return actor;
	}

	pause() {

		if (this._paused) return;
		this._paused = true;

		for (const obj of this.objects) {
			obj.pause();
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
			if (this._actor && !this._actor.isAdded) {
				/// add actor to group.
				game.addActor(this._actor);
			}

			/// Add all objects in group.
			for (const a of this.objects) {
				game.addActor(a);
			}

			for (const s of this.subgroups) {
				game.addGroup(s);
			}

			this.onAdded();

		}

	}


	/**
	 * Show all the objects in the group and subgroups.
	 */
	show() {

		if (this.actor) {
			this.actor.visible = true;
		}

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].show();
		}

	}

	/**
	 * Hide all actors in this group and subgroups.
	 */
	hide() {

		if (this.actor) {
			this.actor.visible = false;
		}

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].hide();
		}

	}

	/**
	 * Get group by class. Searches this group then
	 * recurses up the parent chain, and then to the
	 * current game, if Group has been added to game.
	 * @param type 
	 * @returns 
	 */
	getGroup<G extends Group>(type: Constructor<G>): G | undefined {

		for (let i = this.subgroups.length - 1; i >= 0; i--) {

			if (this.subgroups[i] instanceof type) {
				return this.subgroups[i] as G;
			}
		}

		if (this._parent) {
			return this._parent.getGroup(type)
		} else if (this._game) {
			return this._game.getGroup(type);
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
	 * Return first subgroup found of type.
	 */
	get<GType extends Group<T> = Group<T>>(kind: Constructor<GType>) {

		for (let i = this.subgroups.length - 1; i >= 0; i--) {

			if (this.subgroups[i] instanceof kind) {
				return this.subgroups[i] as GType;
			}

		}
		return null;

	}

	/**
	 * Add subgroup to this group.
	 * @param {Group} sub
	 */
	addGroup(sub: Group) {

		if (!contains(this.subgroups, sub)) {

			if (sub._parent) {

				if (sub._parent === this) return;
				sub._parent.removeGroup(sub);
			}
			sub._parent = this;


			this.subgroups.push(sub);
			this.game?.addGroup(sub)


		}

	}

	/**
	 * Remove Actor from group, but not Game or Engine.
	 * @param {Actor} obj
	 */
	remove(obj: Actor) {

		const ind = this.objects.indexOf(obj);
		if (ind < 0) return;

		this.objects.splice(ind, 1);

		obj.off(EngineEvent.ActorDestroyed, this.remove, this);
		obj.group = null;

	}

	/**
	 *
	 * @param {Actor} obj
	 * @returns {Actor} the object.
	 */
	add(obj: Actor): Actor {

		obj.group = this;
		obj.on(EngineEvent.ActorDestroyed, this.remove, this);

		this.objects.push(obj);
		this._game?.engine.add(obj);

		return obj;

	}

	/**
	 * Internal message of group being removed from game.
	 * Do not call directly.
	 * Override onRemoved() in subclasses for the event.
	 */
	_onRemoved() {

		const game = this._game;
		if (game) {

			this.onRemoved();
			this._game = undefined;

			for (const a of this.objects) {
				game.engine.remove(a);
			}

			for (const s of this.subgroups) {
				game.removeGroup(s);
			}
		}


	}

	/**
	 * Remove subgroup from this group.
	 * @param {Group} sub
	 */
	removeGroup(sub: Group) {

		if (sub._parent !== this) {
			return;
		}
		sub._parent = undefined;

		for (let i = this.subgroups.length - 1; i >= 0; i--) {

			if (this.subgroups[i] == sub) {
				this.subgroups.splice(i, 1);
				break;
			}
		}

		this.game?.removeGroup(sub);


	}


	/**
	 * Override in subclasses to cleanup before group destroyed.
	 */
	onDestroy?(): void;

	destroy() {

		this.isDestroyed = true;

		for (let i = this.subgroups.length - 1; i >= 0; i--) {
			this.subgroups[i].destroy();
		}
		for (let i = this.objects.length - 1; i >= 0; i--) {
			// Don't listen to the remove event since we're already looping.
			this.objects[i].off(EngineEvent.ActorDestroyed, this.remove, this);
			this.objects[i].destroy();
		}
		this.objects.length = 0;
		this.subgroups.length = 0;


		/// workaround to ensure 'game' exists in the onDestroy()
		/// function since _onRemoved() clears it.
		const tempGame = this._game;
		if (this._parent && !this._parent.isDestroyed) {
			this._parent.removeGroup(this);
		} else {
			this._game?.removeGroup(this);
		}

		this._game = tempGame;
		this.onDestroy?.();

		this._paused = true;

		this._actor?.destroy();

		this._parent = undefined;
		this._game = undefined;

	}

}