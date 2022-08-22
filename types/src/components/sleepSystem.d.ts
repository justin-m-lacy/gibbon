import Component from "../core/component";
import GameObject from '../core/game-object';
import Engine from '../engine';
export default class SleepSystem extends Component {
    /**
     * @property {number} _checkTimeFrames - frames between sleep/unsleep checks.
     */
    _checkTimeFrames: number;
    /**
     * @property {number} sleepDist - distance at which object is slept.
     */
    _sleepDist: number;
    /**
     * @property {number} hideDist - distance offscreen at which object is hidden.
     */
    _hideDist: number;
    _sleepers: GameObject[];
    _countdown: number;
    _engine?: Engine;
    /**
     *
     * @param {number} hideDist - distance offscreen at which object should hide.
     * @param {number} sleepDist - distance offscreen at which object should sleep.
     * @param {number} checkTimeFrames - number of frames between sleep checks.
     */
    constructor(hideDist?: number, sleepDist?: number, checkTimeFrames?: number);
    init(): void;
    update(delta: number): void;
}
