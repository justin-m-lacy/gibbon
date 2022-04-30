import Component from '../component';
import GameObject from '../game-object';
/**
 * Not fully developed.
 * Referencing gameObject on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {
    _attachCount: number;
    constructor();
    _init(gameObject: GameObject): void;
    _destroy(): void;
}
