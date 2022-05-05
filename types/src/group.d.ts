import { GameObject } from "..";
import Game from './game';
import { Container } from 'pixi.js';
import Engine from './engine';
/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all GameObject clips added to the group.
 */
export default class Group {
    get gameObject(): GameObject | undefined;
    /**
      * @property clip - clip associated with group, if any.
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
    get paused(): boolean;
    readonly subgroups: Group[];
    readonly objects: GameObject[];
    readonly game: Game;
    get engine(): Engine;
    /**
     * GameObject to hold group components.
     */
    _gameObject?: GameObject;
    _paused: boolean;
    /**
     *
     * @param {Game} game
     * @param {DisplayObject} [clip=null]
     * @param {boolean} [paused=false]
     */
    constructor(game: Game, clip?: Container | undefined | null, paused?: boolean, createGroupObject?: boolean);
    /**
      * Ensure the group has its own group GameObject.
      */
    makeGroupObject(): GameObject;
    pause(): void;
    unpause(): void;
    /**
     * Show all the objects in the group and subgroups.
     */
    show(): void;
    hide(): void;
    findGroup(gname: string): Group | undefined;
    /**
     *
     * @param {Group} g
     */
    addGroup(g: Group): void;
    /**
     *
     * @param {Group} g
     */
    removeGroup(g: Group): void;
    /**
     * Remove GameObject from group, but not Engine.
     * @param {GameObject} obj
     */
    remove(obj: GameObject, removeClip?: boolean): void;
    /**
     *
     * @param {GameObject} obj
     * @returns {GameObject} the object.
     */
    add(obj: GameObject): GameObject;
    destroy(): void;
}
