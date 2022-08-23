import { GridCell } from './grid-cell';
import { GridRange } from './grid-range';

export type Positionable = { x: number, y: number, width: number, height: number, flags?: number, hitFlags?: number };

export class Grid<T extends Positionable> {

    private rows: number;
    private cols: number;

    private _cells: GridCell<T>[][];

    private width: number;
    private height: number;

    private cellWidth: number;
    private cellHeight: number;

    constructor(props: {
        /**
         * Width of entire grid.
         */
        width: number,
        /**
         * height of entire grid.
         */
        height: number,
        rows?: number,
        cols?: number
    }
    ) {

        this.width = props.width;
        this.height = props.height;

        this.rows = props.rows ?? 20;
        this.cols = props.cols ?? 20;


        this.cellWidth = this.width / this.cols;
        this.cellHeight = this.height / this.rows;

        this._cells = this.initTiles();

    }

    addToRange(range: GridRange, item: T) {

        const maxR = range.maxRow;
        const maxC = range.maxCol;
        for (let r = range.minRow; r <= maxR; r++) {

            for (let c = range.minCol; c <= maxC; c++) {
                this._cells[r][c].addItem(item);
            }
        }

    }

    removeFromRange(range: GridRange, item: T) {

        const maxR = range.maxRow;
        const maxC = range.maxCol;
        for (let r = range.minRow; r <= maxR; r++) {

            for (let c = range.minCol; c <= maxC; c++) {
                this._cells[r][c].removeItem(item);
            }
        }

    }

    /**
     * Get hits matching item.
     * @param results 
     */
    getHits(item: T, results: T[] = [], range?: GridRange) {

        range = range ?? this.getRange(item);

        for (let r = range.minRow; r <= range.minRow; r++) {

            for (let c = range.minCol; c <= range.maxCol; c++) {

                this._cells[r][c].getHits(item, results);

            }
        }

        return results;


    }

    /**
     * Get the range of an item.
     * @param item 
     * @param result - Optional grid range in which to place results.
     */
    getRange(item: T, result?: GridRange) {

        result = result ?? new GridRange();

        let v = Math.floor((item.y - item.height / 2) / this.cellHeight);
        if (v < 0) {
            v = 0;
        } else if (v >= this.rows) {
            v = this.rows - 1;
        }
        result.minRow = v;

        v = Math.floor((item.y + item.height / 2) / this.cellHeight);
        if (v < 0) {
            v = 0;
        } else if (v >= this.rows) {
            v = this.rows - 1;
        }
        result.maxRow = v;

        v = Math.floor((item.x - item.width / 2) / this.cellWidth);
        if (v < 0) {
            v = 0;
        } else if (v >= this.cols) {
            v = this.cols - 1;
        }
        result.minCol = v;

        v = Math.floor((item.x + item.width / 2) / this.cellWidth);
        if (v < 0) {
            v = 0;
        } else if (v >= this.cols) {
            v = this.cols - 1;
        }
        result.maxCol = v;

        return result;

    }

    /**
     * Get objects within grid range.
     * @param range 
     * @param results 
     */
    getItems(range: GridRange, results: T[] = []) {

        const maxR = range.maxRow;
        const maxC = range.maxCol;
        for (let r = range.minRow; r <= maxR; r++) {

            for (let c = range.minCol; c <= maxC; c++) {
                this._cells[r][c].getItems(results);
            }
        }

        return results;

    }

    addItem(item: T) {

        let minRow = Math.floor((item.y - item.height / 2) / this.cellHeight);
        if (minRow < 0) {
            minRow = 0;
        } else if (minRow >= this.rows) {
            minRow = this.rows - 1;
        }
        let maxRow = Math.floor((item.y + item.height / 2) / this.cellHeight);
        if (maxRow < 0) {
            maxRow = 0;
        } else if (maxRow >= this.rows) {
            maxRow = this.rows - 1;
        }

        let minCol = Math.floor((item.x - item.width / 2) / this.cellWidth);
        if (minCol < 0) {
            minCol = 0;
        } else if (minCol >= this.cols) {
            minCol = this.cols - 1;
        }
        let maxCol = Math.floor((item.x + item.width / 2) / this.cellWidth);
        if (maxCol < 0) {
            maxCol = 0;
        } else if (maxCol >= this.cols) {
            maxCol = this.cols - 1;
        }

        for (let r = minRow; r <= maxRow; r++) {

            for (let c = minCol; c <= maxCol; c++) {
                this._cells[r][c].addItem(item);
            }
        }

    }
    removeItem(go: T) {
        let minRow = Math.floor((go.y - go.height / 2) / this.cellHeight);
        if (minRow < 0) {
            minRow = 0;
        } else if (minRow >= this.rows) {
            minRow = this.rows - 1;
        }
        let maxRow = Math.floor((go.y + go.height / 2) / this.cellHeight);
        if (maxRow < 0) {
            maxRow = 0;
        } else if (maxRow >= this.rows) {
            maxRow = this.rows - 1;
        }

        let minCol = Math.floor((go.x - go.width / 2) / this.cellWidth);
        if (minCol < 0) {
            minCol = 0;
        } else if (minCol >= this.cols) {
            minCol = this.cols - 1;
        }
        let maxCol = Math.floor((go.x + go.width / 2) / this.cellWidth);
        if (maxCol < 0) {
            maxCol = 0;
        } else if (maxCol >= this.cols) {
            maxCol = this.cols - 1;
        }

        for (let r = minRow; r <= maxRow; r++) {

            for (let c = minCol; c <= maxCol; c++) {
                this._cells[r][c].removeItem(go);
            }
        }
    }

    private initTiles() {

        const a = new Array<Array<GridCell<T>>>(this.rows);
        for (let r = 0; r < this.rows; r++) {

            const b = a[r] = new Array<GridCell<T>>(this.cols);
            for (let c = 0; c < this.cols; c++) {
                b[c] = new GridCell<T>();
            }

        }

        return a;

    }

}