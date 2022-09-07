import { Component } from '../core/component';
import type { IPoint, TPoint } from '../data/geom';

/**
 * Linearly interpolate Actor between current
 * position and target position
 * over a period of time.
 */
export class LerpPos extends Component {

    /**
     * Time to reach target point in seconds.
     */
    lerpTime: number = 3;

    private target: TPoint = { x: 0, y: 0 };

    /**
     * Time spent on current interpolation.
     */
    private deltaTime: number = 0;
    private lerping: boolean = false;

    setDest(target?: IPoint, time?: number) {

        if (target) {
            if (time) {
                this.lerpTime = time;
            }

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

            const t = this.deltaTime / this.lerpTime;
            if (t >= 1) {
                this.position.x = this.target.x;
                this.position.y = this.target.y;
                this.lerping = false;
            } else {
                this.position.set(

                    this.position.x * (1 - t) + t * this.target.x,
                    this.position.y * (1 - t) + t * this.target.y

                );
            }


        }

    }


}