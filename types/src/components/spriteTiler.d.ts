import Component from "../core/component";
import { DisplayObject, TilingSprite } from 'pixi.js';
export default class SpriteTiler extends Component {
    /**
     * @property {DisplayObject} DisplayObject to follow.
     */
    get target(): DisplayObject | undefined;
    set target(v: DisplayObject | undefined);
    _target?: DisplayObject;
    sprite?: TilingSprite;
    /**
     *
     * @param {PIXI.Sprite} tilingSprite
     */
    constructor(tilingSprite?: TilingSprite);
    init(): void;
    update(delta: number): void;
}
