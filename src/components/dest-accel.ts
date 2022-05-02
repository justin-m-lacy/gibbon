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

    /**
     * Radius at which actor should slow down.
     */
    slowRadius: number = 20;

    mover!: Mover;

    setDest(pt: IPoint) {
        this.dest.set(pt.x, pt.y);
    }

    init() {

        this.mover = this.require<Mover>(Mover);
        console.log(`this position: ${this.position}  ${this.position.x}`);
        this.dest.copyFrom(this.position);
        console.log(`dest-accel dest: ${this.dest.x},${this.dest.y}`);
    }

    update(delta: number): void {

        const pt = this.position;

        const dx = this.dest.x - pt.x;
        const dy = this.dest.y - pt.y;

        let d = dx * dx + dy * dy;

        if (d < (this.arriveRadius * this.arriveRadius)) {

            const v = this.mover.velocity;
            /// arrive.
            this.mover.accel = { x: -v.x, y: -v.y };


        } else if (d < this.slowRadius * this.slowRadius) {

            const vx = this.mover.velocity.x;
            const vy = this.mover.velocity.y;

            // targetV - currentV
            const deltaV = (Math.sqrt(d) / this.slowRadius) * this.mover.speedMax
                - Math.sqrt(vx * vx + vy * vy);

            this.mover.accel = { x: deltaV * dx, y: deltaV * dy };

        } else {

            // acceleration cap is handled in mover.
            this.mover.accel = { x: this.mover.accelMax * dx, y: this.mover.accelMax * dy };

        }



    }

}