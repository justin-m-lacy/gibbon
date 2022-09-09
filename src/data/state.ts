import { ComponentKey, Actor } from '../core/actor';
import { Component } from '../core/component';


export type TransitionDef = {
    add?: Array<ComponentKey>;

    remove?: Array<ComponentKey>;


    disable?: Array<ComponentKey>;

    enable?: Array<ComponentKey>;

}

export class Transition {

    /**
     * Components or component types to add when using this transition.
     */
    protected add?: Array<ComponentKey>;

    /**
     * Components or component types to remove when using this transition.
     */
    protected remove?: Array<ComponentKey>;

    /**
     * Components to disable.
     */
    protected disable?: Array<ComponentKey>;

    protected enable?: Array<ComponentKey>;


    constructor(
        changes: TransitionDef) {

        this.add = changes.add;
        this.remove = changes.remove;
        this.disable = changes.disable;
        this.enable = changes.enable;


    }

    /**
     * Set components to disable on this transition.
     * @param disable 
     */
    setDisables(disable: ComponentKey[]) {
        this.disable = disable;
    }

    /**
     * Set components to disable on this transition.
     * @param enable 
     */
    setEnable(enable: ComponentKey[]) {
        this.enable = enable;
    }

    /**
     * Set components to disable on this transition.
     * @param disable 
     */
    setAdds(add: ComponentKey[]) {
        this.add = add;
    }

    /**
     * Set components to disable on this transition.
     * @param disable 
     */
    setRemoves(removes: ComponentKey[]) {
        this.remove = removes;
    }

    /**
     * Apply transition to actor.
     * @param actor 
     */
    apply(actor: Actor) {

        if (this.add) {
            const add = this.add;
            for (let i = 0; i < add.length; i++) {

                const comp = add[i];
                if (comp instanceof Component) {
                    actor!.add(comp);
                } else {
                    actor!.require(comp);
                }
            }
        }
        if (this.enable) {

            const enable = this.enable;
            for (let i = 0; i < enable.length; i++) {
                let comp = enable[i];
                if (comp instanceof Component) {
                    comp.enabled = true;
                } else {
                    const val = actor.get(comp);
                    if (val) {
                        val.enabled = true;
                    }
                }
            }

        }

        if (this.remove) {
            const remove = this.remove;
            for (let i = 0; i < remove.length; i++) {
                actor!.remove(remove[i]);
            }
        }

        if (this.disable) {

            const disable = this.disable;
            for (let i = 0; i < disable.length; i++) {
                let comp = disable[i];
                if (comp instanceof Component) {
                    comp.enabled = false;
                } else {
                    const val = actor.get(comp);
                    if (val) {
                        val.enabled = false;
                    }
                }
            }
        }

    }


}


export class State<TKey = string | number | Symbol> {

    readonly name: TKey;

    onEnter?: Transition;
    onExit?: Transition;

    /**
     * Maps triggers to next state key.
     */
    readonly edges: Map<string, TKey> = new Map();

    constructor(name: TKey) {
        this.name = name;

    }

    /**
     * Add trigger to next state.
     * @param trigger 
     * @param state 
     */
    addTrigger(trigger: string, state: TKey) {
        this.edges.set(trigger, state);
    }

    removeTrigger(trigger: string) {
        this.edges.delete(trigger);
    }

    /**
     * Get name of state resulting from trigger.
     * @param trigger 
     * @returns 
     */
    getNextState(trigger: string) {
        return this.edges.get(trigger);
    }

    /**
     * Set Enter-State Transition.
     * @param t 
     */
    addEnter(t: Transition | TransitionDef) {
        this.onEnter = t instanceof Transition ? t : new Transition(t);
    }

    /**
     * Set leave-state transition.
     * @param t 
     */
    addExit(t: Transition | TransitionDef) {
        this.onExit = t instanceof Transition ? t : new Transition(t);
    }

}