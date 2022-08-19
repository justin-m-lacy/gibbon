import { InteractionEvent, InteractionData, Application } from 'pixi.js';

class WheelController {

    /**
    * Stored value of wheel scrolling function when wheel is enabled.
    */
    private wheelFunc?: (e: WheelEvent) => void;
    private wheelEnabled: boolean = false;

    /**
    * wheelScale - Amount by which to scroll wheel input.
    */
    public wheelScale: number = 1;

    /**
     * Enable mouse wheel events.
     */
    public enableWheel(app: Application) {

        if (this.wheelEnabled === true) return;

        let mgr = app.renderer.plugins.interaction;

        this.wheelEnabled = true;

        // store to remove later.
        this.wheelFunc = (e) => {

            let evt = new InteractionEvent();

            let data = new InteractionData();

            data.originalEvent = e;

            /// TODO: PIXI has changed implementation for this:
            //data.deltaY = e.deltaY * this.wheelScale;
            //data.deltaX = e.deltaX * this.wheelScale;

            data.originalEvent = e;

            Object.assign(data, mgr.eventData);

            let target = evt.target = data.target;
            evt.data = data;
            evt.type = 'wheel';

            while (target) {

                if (target.interactive === true) {
                    evt.currentTarget = target;
                    target.emit('wheel', evt);
                }
                target = target.parent;

            }

        };

        app.view.addEventListener('wheel', this.wheelFunc);

    }

    /**
 * Disable wheel events.
 */
    disableWheel(app: Application) {

        if (this.wheelEnabled === true) {
            if (this.wheelFunc) {
                app.view.removeEventListener('wheel', this.wheelFunc);
            }
            this.wheelFunc = undefined;
            this.wheelEnabled = false;
        }

    }

}

export const WheelControl = new WheelController();
