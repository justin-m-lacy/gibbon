import Component from "../component";
export default class TimeDestroy extends Component {
    /**
     * @property {number} time - time in milliseconds before destroy/effect.
     * Setting to new value resets the timer.
     */
    get timeMs(): number;
    set timeMs(v: number);
    _timer: number;
    constructor();
    update(delta: number): void;
}
