import { Component } from '../core/component';

/**
 * Component whose purpose is to hold/share data.
 */
export class ActorData<T extends any> extends Component {


    data: T;

    constructor(data: T) {
        super();

        this.data = data;
    }

}