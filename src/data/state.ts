import type { ComponentKey, Actor } from '../core/actor';
import { Component } from '../core/component';


export type StateEffectDef = {
    add?: Array<ComponentKey>;

    remove?: Array<ComponentKey>;


    disable?: Array<ComponentKey>;

    enable?: Array<ComponentKey>;

}

export class StateEffect {

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
        changes: StateEffectDef) {

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

export class Transition<TKey = string | number | symbol> {

    dest: TKey;

    /**
     * Time before transition enters new state.
     */
    enterTime: number;

    constructor(destState: TKey, enterTime: number = 0) {
        this.dest = destState;
        this.enterTime = enterTime;
    }

}

export class State<TKey = string | number | Symbol, TTrigger = string | Symbol> {

    readonly name: TKey;

    onEnter?: StateEffect;
    onExit?: StateEffect;

    autoNext?: Transition<TKey>;

    /**
     * Maps triggers to next state key.
     */
    private readonly edges: Map<TTrigger, TKey> = new Map();

    constructor(name: TKey, opts?: { onEnter?: StateEffect | StateEffectDef, onExit?: StateEffect | StateEffectDef, autoNext?: Transition<TKey> }) {
        this.name = name;

        if (opts) {
            if (opts.onEnter) {
                this.onEnter = opts.onEnter instanceof StateEffect ? opts.onEnter : new StateEffect(opts.onEnter!);
            }
            if (opts.onExit) {
                this.onExit = opts.onExit instanceof StateEffect ? opts.onExit : new StateEffect(opts.onExit!);
            }
            this.autoNext = opts.autoNext;
        }
    }

    /**
     * 
     * @param state 
     * @returns true if an edge exists that leads
     * from this state to the named state. This is not
     * an efficient search.
     */
    hasEdge(state: TKey) {
        for (const name of this.edges.values()) {
            if (name === state) return true;
        }
        return false;
    }

    /**
     * @param trigger 
     * @returns True if the state contains an edge
     * to another state with this trigger.
     */
    canTrigger(trigger: TTrigger) {
        return this.edges.has(trigger);
    }

    /**
     * Add trigger to next state.
     * @param trigger 
     * @param state 
     */
    addTrigger(trigger: TTrigger, state: TKey) {
        this.edges.set(trigger, state);
    }

    removeTrigger(trigger: TTrigger) {
        this.edges.delete(trigger);
    }

    /**
     * Get name of state resulting from trigger.
     * @param trigger 
     * @returns 
     */
    getNextState(trigger: TTrigger) {
        return this.edges.get(trigger);
    }

    /**
     * Set Enter-State Transition.
     * @param t 
     */
    addEnter(t: StateEffect | StateEffectDef) {
        this.onEnter = t instanceof StateEffect ? t : new StateEffect(t);
    }

    /**
     * Set leave-state transition.
     * @param t 
     */
    addExit(t: StateEffect | StateEffectDef) {
        this.onExit = t instanceof StateEffect ? t : new StateEffect(t);
    }

}