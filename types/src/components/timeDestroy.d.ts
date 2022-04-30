import Component from "../component";
import { Signal } from 'signals';
export default class TimeDestroy extends Component {
    /**
     * @property {number} timer - time remaining in sec. before destroy/effect.
     * @note internal timer is in ms for loop convenience.
     */
    get remainingSec(): number;
    set remainingSec(v: number);
    /**
     * @property {Signal} onComplete - fires when time complete.
     */
    get onComplete(): Signal<any>;
    /**
     * @property {number} time - time in milliseconds before destroy/effect.
     * Setting to new value resets the timer.
     */
    get timeMs(): number;
    set timeMs(v: number);
    _timer: number;
    _sigDone: Signal;
    constructor();
    update(delta: number): void;
    onDestroy(): void;
}
