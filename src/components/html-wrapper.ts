import Component from '../core/component';
import { Point } from 'pixi.js';
export type HtmlWrapperOpts = {

    /**
     * Automatically remove html element from dom when component destroyed.
     * Default is true.
     */
    autoRemove?: boolean,

    /**
     * Html Element positioning mode.
     */
    position?: 'relative' | 'absolute' | 'sticky' | 'fixed' | 'static'

}

/**
 * Displays raw HtmlElement.
 * Should not be used for intensive animation, effects.
 */
export default class HtmlWrapper extends Component {

    get element() { return this._elm; }
    set element(v: HTMLElement | undefined | null) {
        this._elm = v;
        if (v) {
            this._display = v.style.display;
        }
    }

    get width(): number {
        return this._elm?.clientWidth ?? 0;
    }
    set width(v: number) {
        if (this._elm) {
            this._elm.style.minWidth = this._elm.style.maxWidth = this._elm.style.width = `${v} px`;
        }
    }

    get height(): number {
        return this._elm?.clientHeight ?? 0;
    }
    set height(v: number) {
        if (this._elm) {
            this._elm.style.minHeight = this._elm.style.maxHeight = this._elm.style.height = `${v} px`;
        }
    }

    set x(x: number) {
        if (this._elm) {
            this._elm.style.left = `${x} px`;
        }
        super.x = x;
    }

    set y(y: number) {
        if (this._elm) {
            this._elm.style.left = `${y} px`;
        }
        super.y = y;
    }

    set position(p: Point) {
        if (this._elm) {
            this._elm.style.right = `${p.x} px`;
            this._elm.style.left = `${p.y} px`;
        }
        super.position = p;
    }

    _elm?: HTMLElement | null;

    /// display to restore after hiding.
    _display?: string;

    _elmPosition?: string;


    autoRemove: boolean;

    /**
     * 
     * @param elm - html element or unique id of element in document.
     * @param opts 
     */
    constructor(elm?: HTMLElement | string, opts?: HtmlWrapperOpts) {

        super();

        this._elm = typeof elm == 'string' ? document.getElementById(elm) : elm;
        this._display = this._elm?.style.display;

        this.autoRemove = opts?.autoRemove ?? true;
        if (this._elm) {
            if (opts?.position != null) {
                this._elm.style.position = opts?.position;
            }
        }

    }

    onEnable() {
        if (this._elm) {
            this._elm.style.display = this._display ?? 'block';
        }
    }
    onDisable() {
        if (this._elm) {
            this._elm.style.display = 'none';
        }
    }


    onDestroy(): void {

        if (this.autoRemove) {
            this._elm?.remove();
        }
        this._elm = null;

    }

}