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

    /**
     * Maps triggers to next state name.
     */
    readonly edges: Map<string, string> = new Map();

    constructor(name: string) {
        this.name = name;

    }

    /**
     * Add trigger to next state.
     * @param trigger 
     * @param state 
     */
    addTrigger(trigger: string, state: string) {
        this.edges.set(trigger, state);
    }

    removeTrigger(trigger: string) {
        this.edges.delete(trigger);
    }

    trigger(t: string) {
        return this.edges.get(t);
    }

    /**
     * Set Enter-State Transition.
     * @param t 
     */
    addEnter(t: Transition | Partial<Transition>) {
        this.onEnter = t instanceof Transition ? t : new Transition(t.toAdd, t.toRemove);
    }

    /**
     * Set leave-state transition.
     * @param t 
     */
    addExit(t: Transition | Partial<Transition>) {
        this.onExit = t instanceof Transition ? t : new Transition(t.toAdd, t.toRemove);
    }

}