import Component from "@/core/component";
import { World2d } from "./world2d";

export class Collider2d extends Component {

    /**
     * 
     * @param tree - world to insert collider into.
     */
    constructor(world: World2d) {

        super();
    }

    init() {

        this.onActivate = this.onEnable = this.addToWorld;
        this.onDeactivate = this.onDisable = this.onDestroy = this.removeFromWorld;
    }

    addToWorld() {

    }

    removeFromWorld() {
    }

}