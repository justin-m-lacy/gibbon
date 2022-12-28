import { quickSplice } from "@/utils/array-utils";
import { Positionable } from "./grid";

export class GridCell<T extends Positionable> {

    private items: Array<T> = [];

    public clear() {
        this.items.length = 0;
    }

    /**
     * Get objects in cell that overlap given flags.
     * @param object - Object being hit tested. Included so it wont hit test
     * against itself.
     * @param results - optional results array.
     * @returns 
     */
    public getHits(object: T, results: T[] = []) {


        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];

            if (item != object && (!item.flags || !object.hitFlags || (item.flags & object.hitFlags))) {
                results.push(item);
            }
        }

        return results;

    }

    public getItems(results: T[] = []) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (results.indexOf(this.items[i]) < 0) {
                results.push(this.items[i]);
            }
        }
        return results;
    }

    public addItem(go: T) {

        if (this.items.indexOf(go) < 0) {
            this.items.push(go);
        }
    }

    public removeItem(go: T) {

        for (let i = this.items.length - 1; i >= 0; i--) {

            if (this.items[i] == go) {
                quickSplice(this.items, i);
                return;
            }
        }

    }

}