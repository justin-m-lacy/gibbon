import Component from "@/component";
import { IPoint } from '../game-object';

export type Heading = {

    at: IPoint,
    velocity: IPoint,

}

/**
 * 
 */
class Reckoner extends Component {

    get heading() { return this._heading; }
    set heading(v) {
        this._heading = v;
        this.receivedAt = Date.now();
    }

    /**
    * Time when last heading was received.
    */
    receivedAt: number = 0;


    remoteDest!: IPoint;
    remotePos!: IPoint;
    remoteVelocity!: IPoint;

    /**
     * Time to match actual reckoned location, per unit distance.
     */
    timeToMatchMs: number = 10;



    /**
     * Expected delay in heading information from server.
     */
    delayMs: number = 100;

    private _heading?: Heading;

    update(delta: number) {

        if (this._heading) {

            /// compute theoretical server position.
            const time = (Date.now() - this.receivedAt) + this.delayMs;


            const atX = this._heading.at.x + this._heading.velocity.x * time;
            const atY = this._heading.at.y + this._heading.velocity.y * time;

        }

    }

}