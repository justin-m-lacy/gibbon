import Component from '../component';
import { Point } from 'pixi.js';
import Mover from './mover';
import { IPoint } from '../game-object';

/**
 * Uses mover component to accelerate towards a destination point
 * and deccelerate upon arrival.
 */
export default class DestAccel extends Component {

    readonly dest: Point = new Point();

    /**
     * Radius at which to begin arrival slowdown.
     * todo: compute from current move velocity and acceleration?
     */
    arriveRadius: number = 10;

    mover?: Mover | null;

    setDest(pt: IPoint) {
        this.dest.set(pt.x, pt.y);
    }

    init() {

        this.mover = this.get<Mover>(Mover);
        this.dest.copyFrom(this.position);
    }

    update(delta: number): void {

        if (this.mover) {

            const pt = this.position;

            const dx = this.dest.x - pt.x;
            const dy = this.dest.y - pt.y;

            if ((dx * dx + dy * dy) < (this.arriveRadius * this.arriveRadius)) {

                const v = this.mover.velocity;
                /// arrive.
                this.mover.accel = { x: -v.x, y: -v.y };


            } else {

                this.mover.accel = { x: dx, y: dy };

            }




        }

    }

}