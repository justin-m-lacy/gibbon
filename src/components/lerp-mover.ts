import { Component } from '../core/component';
import type { IPoint } from '../core/actor';
import { Mover } from './mover';

/**
 * Linearly interpolate Actor between two points over
 * a defined time frame.
 */
export class LerpMover extends Component {

    private lerpTimeSec: number = 300;
    private target: IPoint = { x: 0, y: 0 };

    /**
     * Time spent on current interpolation.
     */
    private deltaTime: number = 0;
    private lerping: boolean = false;

    /**
     * Whether to add current velocity to target point
     * every frame.
     */
    private addVelocity: boolean = false;

    setDest(target?: IPoint) {

        if (target) {
            this.target.x = target.x;
            this.target.y = target.y;
            this.lerping = true;
            this.deltaTime = 0;

        } else {
            this.lerping = false;
        }
    }

    override update(deltaS: number) {

        if (this.lerping && this.target != null) {

            this.deltaTime += deltaS;
            if (this.addVelocity) {


                const mover = this.get(Mover);
                if (mover) {
                    this.position.x += mover.x * deltaS;
                    this.position.y += mover.y * deltaS;
                }

            }

            let t = this.deltaTime / this.lerpTimeSec;
            if (t >= 1) {
                t = 1;
                this.lerping = false;
            }
            this.position.set(

                this.position.x * (1 - t) + t * this.target.x,
                this.position.y * (1 - t) + t * this.target.y

            );

        }

    }


}