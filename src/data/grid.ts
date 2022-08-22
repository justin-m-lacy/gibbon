import GameObject from '@/core/game-object';
import { GridCell } from './grid-cell';

export class Grid {

    private rows: number;
    private cols: number;

    private _cells: GridCell[][];

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

    addObject(go: GameObject) {

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
                this._cells[r][c].addItem(go);
            }
        }

    }
    removeObject(go: GameObject) {
    }

    private initTiles() {

        const a = new Array<Array<GridCell>>(this.rows);
        for (let r = 0; r < this.rows; r++) {

            const b = a[r] = new Array<GridCell>(this.cols);
            for (let c = 0; c < this.cols; c++) {
                b[c] = new GridCell();
            }

        }

        return a;

    }

}