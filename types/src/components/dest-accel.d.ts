import Component from '../component';
import { Point } from 'pixi.js';
import Mover from './mover';
import { IPoint } from '../game-object';
/**
 * Uses mover component to accelerate towards a destination point
 * and deccelerate upon arrival.
 */
export default class DestAccel extends Component {
    readonly dest: Point;
    /**
     * Radius at which to begin arrival slowdown.
     * todo: compute from current move velocity and acceleration?
     */
    arriveRadius: number;
    mover?: Mover | null;
    setDest(pt: IPoint): void;
    init(): void;
    update(delta: number): void;
}