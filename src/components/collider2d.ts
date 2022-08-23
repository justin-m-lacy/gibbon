import { Point } from "pixi.js";
import Component from "../core/component";

export class Collider2d extends Component {

    get width() { return this.actor.width; }

    get height() { return this.actor.height }

    private _lastPos: Point;
    private _lastSize: Point;

    /**
     * Actor flags of objects to check hits against.
     * Hits will only be tested when
     * (otherActor.flags & this.hitFlags )!==0
     */
    hitFlags: number = Number.MAX_SAFE_INTEGER;

    /**
     * True if actor does not move.
     */
    public isStatic: boolean = false;

    private _changed: boolean = false;

    /**
     * Returns true if size or position has changed this frame.
     * Currently unused.
     */
    public get changed() {
        return this._changed;
    }
    constructor() {

        super();
    }

    init() {

        const pos = this.position;
        const size = this.actor.transform.size;

        this._lastPos = new Point(pos.x, pos.y);
        this._lastSize = new Point(size.x, size.y);

        //this.onActivate = this.onEnable = this.addToWorld;
        //this.onDeactivate = this.onDisable = this.onDestroy = this.removeFromWorld;
    }

    /*addToWorld() {
    }

    removeFromWorld() {
    }*/


    /*update(delta: number) {

        const pos = this.position;
        const size = this.actor.transform.size;

        if (pos.x != this._lastPos.x || pos.y != this._lastPos.y || size.x != this._lastSize.x || size.y != this._lastSize.y) {
            this._changed = true;
        } else {
            this._changed = false;
        }
        this._lastPos.set(pos.x, pos.y);
        this._lastSize.set(size.x, size.y);


    }*/


}