export declare class Gradient {
    colors: number[];
    /**
     * @property {number[]} stops - percent stops of each color.
     * first step should start at 0, last should be 1.
     */
    stops: number[];
    constructor(colors: number[], stops: number[]);
    /**
     * Add the Gradient color steps to the CanvasGradient.
     * @param {CanvasGradient} grad
     */
    addStops(grad: CanvasGradient): void;
    /**
     * Ensure stops range from 0 to 1.
     */
    normalize(): void;
}
