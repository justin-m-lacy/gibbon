import GameObject from "@/core/game-object";
import { quickSplice } from "@/utils/array-utils";

export class GridCell {

    private items: Array<GameObject> = [];

    constructor() {
    }

    addItem(go: GameObject) {

        if (this.items.indexOf(go) < 0) {
            this.items.push(go);
        }
    }

    removeItem(go: GameObject) {

        for (let i = this.items.length - 1; i >= 0; i--) {

            if (this.items[i] == go) {
                quickSplice(this.items, i);
                return;
            }
        }

    }

}