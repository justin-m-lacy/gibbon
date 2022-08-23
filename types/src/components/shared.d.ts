import Component from '../core/component';
import Actor from '../core/actor';
/**
 * Not fully developed.
 * Referencing actor on SharedComponent is not currently safe.
 */
export default class SharedComponent extends Component {
    private _attachCount;
    constructor();
    _init(actor: Actor): void;
    _destroy(): void;
}
