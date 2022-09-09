import { Component } from "@/components";
import { Constructor } from '../utils/types';

export class Transition {

    /**
     * Components or component types to add when using this transition.
     */
    toAdd: Array<Component | Constructor<Component>>;

    /**
     * Components or component types to remove when using this transition.
     */
    toRemove: Array<Component | Constructor<Component>>;

    constructor(add?: (Component | Constructor<Component>)[], remove?: (Component | Constructor<Component>)[]) {

        this.toAdd = add ?? [];
        this.toRemove = remove ?? [];

    }

}


export class State {

    readonly name: string;

    onEnter?: Transition;
    onExit?: Transition;

    constructor(name: string) {
        this.name = name;

    }

    addEnter(t: Transition | Partial<Transition>) {
        this.onEnter = t instanceof Transition ? t : new Transition(t.toAdd, t.toRemove);
    }

    addExit(t: Transition | Partial<Transition>) {
        this.onExit = t instanceof Transition ? t : new Transition(t.toAdd, t.toRemove);
    }

}