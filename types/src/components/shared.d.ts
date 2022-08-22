import Component from '../core/component';
import GameObject from '../core/game-object';
/**
 * Not fully developed.
 * Referencing gameObject on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {
    private _attachCount;
    constructor();
    _init(gameObject: GameObject): void;
    _destroy(): void;
}
