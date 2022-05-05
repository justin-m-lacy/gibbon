import { Point, DisplayObject, Rectangle } from 'pixi.js';
import Component from '../component';
export default class Camera extends Component {
    get target(): DisplayObject | null;
    set target(v: DisplayObject | null);
    get minScale(): number;
    set minScale(v: number);
    get maxScale(): number;
    set maxScale(v: number);
    get viewScale(): number;
    set viewScale(v: number);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    /**
     * @property {Rectangle} Visible rectangle in the Camera's coordinate system.
     */
    get viewRect(): Rectangle | null;
    /**
     * @property {Rectangle} Size of the Canvas.
     */
    get screen(): Rectangle;
    set screen(v: Rectangle);
    get centerX(): number;
    get centerY(): number;
    get center(): Point;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    private _screen;
    private _target;
    private _minScale;
    private _maxScale;
    private _viewScale;
    private _viewRect;
    private _panClip?;
    private _halfWidth;
    private _halfHeight;
    constructor();
    /**
     * Determines if an item is completely within the view.
     * @param {*} it
     * @returns true if item is completely onscreen, false otherwise.
     */
    containsItem(it: any): boolean;
    /**
     *
     * @param {*} it
     * @returns true if item is within the camera view, false otherwise.
     */
    itemInView(it: any): boolean;
    /**
     *
     * @param {PIXI.Point} p
     */
    ptInView(p: Point): Boolean;
    /**
     *
     * @param {Rectangle} r
     * @returns true if a rectangle falls within the camera view, false otherwise.
     */
    rectInView(r: Rectangle): boolean | undefined;
    /**
     *
     * @param {PIXI.Point} global
     * @param {PIXI.Point} [dest=null]
     * @returns {PIXI.Point}
     */
    toCameraPoint(global: Point, dest?: Point): Point | undefined;
    init(): void;
    update(delta: number): void;
}
