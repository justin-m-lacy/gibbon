import Component from '../core/component';
import { Point } from 'pixi.js';
export declare type HtmlWrapperOpts = {
    /**
     * Automatically remove html element from dom when component destroyed.
     * Default is true.
     */
    autoRemove?: boolean;
    /**
     * Html Element positioning mode.
     */
    position?: 'relative' | 'absolute' | 'sticky' | 'fixed' | 'static';
    /**
 * Create named element if not found.
 */
    createElement?: boolean;
};
/**
 * Displays raw HtmlElement.
 * Should not be used for intensive animation, effects.
 */
export default class HtmlWrapper extends Component {
    get element(): HTMLElement | undefined | null;
    set element(v: HTMLElement | undefined | null);
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    set x(x: number);
    set y(y: number);
    set position(p: Point);
    _elm?: HTMLElement | null;
    _display?: string;
    autoRemove: boolean;
    /**
     *
     * @param elm - html element or unique id of element in document.
     * @param opts
     */
    constructor(elm?: HTMLElement | string, opts?: HtmlWrapperOpts);
    private initElement;
    private createNamedDiv;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
}
