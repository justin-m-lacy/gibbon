import { Component } from '../core/component';
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
    position?: 'relative' | 'absolute' | 'sticky' | 'fixed' | 'static',

    /**
 * Create named element if not found.
 */
    createElement?: boolean

}

/**
 * Displays raw HtmlElement.
 * Should not be used for intensive animation, effects.
 */
export class HtmlWrapper extends Component {

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
            this._elm.style.minWidth = this._elm.style.maxWidth = this._elm.style.width = `${v}px`;
        }
    }

    get height(): number {
        return this._elm?.clientHeight ?? 0;
    }
    set height(v: number) {
        if (this._elm) {
            this._elm.style.minHeight =
                this._elm.style.maxHeight = this._elm.style.height = `${v}px`;
        }
    }

    set x(x: number) {
        if (this._elm) {
            this._elm.style.left = `${x}px`;
        }
        super.x = x;
    }

    set y(v: number) {
        if (this._elm) {
            this._elm.style.top = `${v}px`;
        }
        super.y = v;
    }

    set position(p: Point) {
        if (this._elm) {
            this._elm.style.left = `${p.x}px`;
            this._elm.style.top = `${p.y}px`;
        }
        super.position = p;
    }

    set display(s: string | undefined) {
        this._display = s;
        if (this._elm) {
            this._elm.style.display = s ?? 'none';
        }
    }

    get visible() {
        return this._elm?.style.display !== 'none' && this.enabled;
    }
    set visible(b: boolean) {
        this.enabled = b;
    }

    get display() { return this._elm?.style.display }
    protected _elm?: HTMLElement | null;

    /// display to restore after hiding.
    protected _display?: string;

    autoRemove: boolean;

    /**
     * 
     * @param elm - html element or unique id of element in document.
     * @param opts 
     */
    constructor(elm?: HTMLElement | string, opts?: HtmlWrapperOpts) {

        super();

        this.initElement(elm, opts);
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

    private initElement(elmId?: string | HTMLElement | null, opts?: HtmlWrapperOpts) {

        if (typeof elmId === 'string') {
            this._elm = document.getElementById(elmId);
            if (this._elm == null && opts?.createElement) {
                this._elm = this.createNamedDiv(elmId);
            }

        } else if (elmId == null && opts?.createElement === true) {
            this._elm = this.createNamedDiv();
        } else {
            this._elm = elmId;
        }

    }


    private createNamedDiv(elmId?: string) {
        const elm = document.createElement('div');
        if (elmId) elm.id = elmId;
        document.body.appendChild(elm);
        return elm;
    }

    onDestroy(): void {

        if (this.autoRemove) {
            this._elm?.remove();
        }
        this._elm = null;

    }

}