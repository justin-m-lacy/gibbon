export class GridRange {

    minRow: number = 0;
    minCol: number = 0;
    maxRow: number = 0;
    maxCol: number = 0;

    constructor(minRow: number = 0, maxRow: number = 0, minCol: number = 0, maxCol: number = 0) {

        this.minRow = minRow;
        this.maxRow = maxRow;
        this.minCol = minCol;
        this.maxCol = maxCol;
    }

    equals(gr: GridRange) {
        return this.minRow === gr.minRow && this.maxRow === gr.maxRow && this.minCol === gr.maxCol && this.maxCol === gr.maxCol;
    }

}