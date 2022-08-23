import Component from '../core/component';
import { Point } from 'pixi.js';
import Mover from './mover';
import { IPoint } from '../core/actor';


/**
 * Uses mover component to accelerate towards a destination point
 * and deccelerate upon arrival.
 */
export default class DestAccel extends Component {

    readonly dest: Point = new Point();

    /**
     * Radius at which to attempt to stop.
     * todo: compute from current move velocity and acceleration?
     */
    stopRadius: number = 40;

    /**
     * Radius at which actor should slow down.
     */
    slowRadius: number = 150;

    mover!: Mover;

    setDest(pt: IPoint) {
        this.dest.set(pt.x, pt.y);
    }

    init() {

        this.mover = this.require<Mover>(Mover);
        this.dest.copyFrom(this.position);
    }

    update(delta: number): void {

        const pt = this.position;

        const dx = this.dest.x - pt.x;
        const dy = this.dest.y - pt.y;

        let d = dx * dx + dy * dy;

        if (d < (this.stopRadius * this.stopRadius)) {

            const v = this.mover.velocity;
            /// arrive.
            this.mover.accel = { x: -v.x, y: -v.y };


        } else if (d < this.slowRadius * this.slowRadius) {

            const vx = this.mover.velocity.x;
            const vy = this.mover.velocity.y;

            // targetV - currentV
            const deltaV = (Math.sqrt(d) / this.slowRadius) * this.mover.velocityMax
                - Math.sqrt(vx * vx + vy * vy);

            this.mover.accel = { x: deltaV * dx, y: deltaV * dy };

        } else {

            // acceleration cap is handled in mover.
            this.mover.accel = { x: this.mover.accelMax * dx, y: this.mover.accelMax * dy };

        }



    }

}