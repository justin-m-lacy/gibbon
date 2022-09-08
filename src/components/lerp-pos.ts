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
     * This may be an expected lag time from server.
     */
    lerpTime: number = 0.300;

    private target: TPoint = { x: 0, y: 0 };
    private targetAngle?: number = 0;


    /**
     * Time spent on current interpolation.
     */
    private deltaTime: number = 0;
    private lerping: boolean = false;

    setDest(target?: IPoint, angle?: number, time?: number) {

        if (target) {
            if (time) {
                this.lerpTime = time;
            }

            this.targetAngle = angle;

            this.target.x = target.x;
            this.target.y = target.y;
            this.lerping = true;
            this.deltaTime = 0;

        } else {
            this.lerping = false;
        }
    }

    /**
     * Add an expected motion to the target.
     * This is useful when the local simulation is behind
     * a server, but the server point is expected to continue
     * moving with a velocity or angular velocity.
     * @param pt 
     * @param angle 
     */
    addDelta(pt: IPoint, angle?: number) {

        this.target.x += pt.x;
        this.target.y += pt.y;

        if (this.targetAngle && angle) {
            this.targetAngle += angle;
        }
    }

    override update(deltaS: number) {

        if (this.lerping && this.target != null) {

            this.deltaTime += deltaS;

            const t = this.deltaTime / this.lerpTime;
            if (t >= 1) {
                this.position.x = this.target.x;
                this.position.y = this.target.y;

                if (this.targetAngle) {
                    this.rotation = this.targetAngle;
                }

                this.lerping = false;
            } else {

                if (this.targetAngle) {

                    let dAngle = this.targetAngle - this.rotation;
                    if (Math.abs(dAngle) > Math.PI) {
                        dAngle = dAngle > 0 ? dAngle - 2 * Math.PI : dAngle + 2 * Math.PI;
                    }
                    this.rotation = t * dAngle + this.rotation;

                }

                this.position.set(

                    (1 - t) * this.position.x + t * this.target.x,
                    (1 - t) * this.position.y + t * this.target.y

                );
            }


        }

    }


}