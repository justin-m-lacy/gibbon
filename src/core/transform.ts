
import { Component } from "../core/component";
import { quickSplice } from "../utils/array-utils";
import { Constructor } from "../utils/types";
import { Point } from 'pixi.js';
import { EngineEvent } from "../events/engine-events";
import { IPoint } from './actor';


export class Transform extends Component {

    private readonly _position: Point = new Point();

    private _rotation: number = 0;

    name?: string;

    get position(): Point { return this._position; }
    set position(v: Point) { this._position.set(v.x, v.y); }

    get x(): number { return this._position.x; }
    set x(x: number) { this._position.x = x; }

    get y(): number { return this._position.y; }
    set y(y: number) { this._position.y = y; }

    get rotation(): number { return this._rotation; }
    set rotation(v: number) {
        while (v > Math.PI) v -= 2 * Math.PI;
        while (v < -Math.PI) v += 2 * Math.PI;
        this._rotation = v;
    }

    get size() { return this._size; }

    get width() { return this._size.x }
    set width(v) { this._size.x = v; }

    get height() { return this._size.y }
    set height(v) { this._size.y = v; }

    private _size: IPoint = { x: 0, y: 0 };

    private _parent?: Transform;
    public get parent() { return this._parent; }

    private readonly _children: Transform[] = [];
    public get children() { return this._children.values() }
    [Symbol.iterator]() { return this._children.values(); }

    constructor(pos?: Point | null) {

        super();

        if (pos) {
            this._position.set(pos.x, pos.y);
        }

    }

    init() {
    }

    /**
     * Find all children with component type.
     * @param {*} cls
     * @param results - Optional array to place results in.
     */
    findInChildren<T extends Component>(cls: Constructor<T>, results: Array<T> = []) {

        for (let i = this._children.length - 1; i >= 0; i--) {
            const comp = this._children[i].get(cls);
            if (comp) {
                results.push(comp);
            }
        }
        return results;

    }

    /**
     * Find components recursively in all children.
     * This is an expensive operation.
     * @param cls 
     */
    findRecursive<T extends Component>(cls: Constructor<T>, results: Array<T> = []) {

        for (let i = this._children.length - 1; i >= 0; i--) {
            const child = this._children[i];
            const comp = child.get(cls);
            if (comp) {
                results.push(comp);
            }
            child.findRecursive(cls, results);
        }
        return results;

    }

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    translate(x: number, y: number) {
        this._position.x += x;
        this._position.y += y;
    }

    addChild(t: Transform) {

        if (t === this) {
            console.log(`Attempt to set self as parent failed.`);
        } else if (t._parent != this) {

            const oldParent = t._parent;
            t._parent = this;

            oldParent?.removeChild(t);

            this._children.push(t);

            this.actor!.emit(EngineEvent.ChildAdded, t);

        }

    }

    /**
     *
     * @param t - Child transform to remove.
     * The child will be added to the root actor's children.
     * A transform cannot be removed from root.
     * To do this, add it to another transform's children instead.
     * @returns 
     */
    removeChild(t: Transform) {

        const ind = this._children.indexOf(t);
        if (ind >= 0) {
            quickSplice(this._children, ind);
        }
        this.actor?.emit(EngineEvent.ChildRemoved, t);

        if (t._parent == this) {
            t._parent = undefined;
        }

    }

}