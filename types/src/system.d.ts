import Group from "./core/group";
import Game from './game';
import { IUpdater } from "./engine";
import { Container } from 'pixi.js';
export default class System extends Group implements IUpdater {
    /**
     * @property {boolean} enabled
     */
    get enabled(): boolean;
    set enabled(v: boolean);
    _enabled: boolean;
    /**
     *
     * @param {Game} game
     * @param {GameObject} clip - system container clip.
     * @param {boolean} [enabled=false] - whether to start System immediately.
     */
    constructor(game: Game, clip?: Container, enabled?: boolean);
    start(): void;
    stop(): void;
    pause(): void;
    unpause(): void;
    destroy(): void;
    /**
     * Override in subclasses.
     */
    update(delta: number): void;
}
