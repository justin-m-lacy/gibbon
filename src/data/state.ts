import type { ComponentKey } from '../core/actor';
import { Component } from '../core/component';
import { Actor } from '../core/actor';
import { addUnique } from '../utils/array-utils';

type EffectTarget = ComponentKey | Actor;

export type StateEffectDef = {
    add?: Array<ComponentKey>;

    remove?: Array<ComponentKey>;


    disable?: Array<EffectTarget>;

    enable?: Array<EffectTarget>;

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
    protected disable?: Array<EffectTarget>;

    protected enable?: Array<EffectTarget>;


    constructor(
        changes: StateEffectDef) {

        this.add = changes.add;
        this.remove = changes.remove;
        this.disable = changes.disable;
        this.enable = changes.enable;


    }

    addEffects(effects: StateEffectDef) {

        if (effects.add) {
            if (this.add) {
                addUnique(this.add, effects.add);
            } else {
                this.add = effects.add;
            }
        }

        if (effects.remove) {
            if (this.remove) {
                addUnique(this.remove, effects.remove);
            } else {
                this.remove = effects.remove;
            }
        }

        if (effects.disable) {
            if (this.disable) {
                addUnique(this.disable, effects.disable);
            } else {
                this.disable = effects.disable;
            }
        }

        if (effects.enable) {
            if (this.enable) {
                addUnique(this.enable, effects.enable);
            } else {
                this.enable = effects.enable;
            }
        }

    }

    /**
     * Get list of components/actors to be enabled on transition.
     */
    getEnables() { return this.enable; }

    /**
     * Get list of components/actors to be disabled on transition.
     */
    getDisables() { return this.disable; }

    /**
     * Get list of components to be removed on transition.
     */
    getRemoves() { return this.remove; }


    /**
     * Get list of components to be added on transition.
     */
    getAdds() { return this.add; }

    /**
     * Add component or component type to be added.
     */
    addAdd(effect: ComponentKey) {
        if (this.add === undefined) {
            this.add = [effect];
        } else if (!this.add.includes(effect)) {
            this.add.push(effect);
        }
    }

    /**
     * Add component or component type to be removed.
     */
    addRemove(effect: ComponentKey) {
        if (this.remove === undefined) {
            this.remove = [effect];
        } else if (!this.remove.includes(effect)) {
            this.remove.push(effect);
        }
    }


    addEnable(effect: EffectTarget) {
        if (this.enable === undefined) {
            this.enable = [effect];
        } else if (!this.enable.includes(effect)) {
            this.enable.push(effect);
        }
    }

    addDisable(effect: EffectTarget) {
        if (this.disable === undefined) {
            this.disable = [effect];
        } else if (!this.disable.includes(effect)) {
            this.disable.push(effect);
        }
    }

    /**
     * Set components to disable on this transition.
     * @param disable 
     */
    setDisables(disable: EffectTarget[]) {
        this.disable = disable;
    }

    /**
     * Set components to disable on this transition.
     * @param enable 
     */
    setEnable(enable: EffectTarget[]) {
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

                if ('_isComponent' in comp) {
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
                if ('_isComponent' in comp) {
                    comp.enabled = true;
                }
                else if ('active' in comp) {
                    comp.active = true;
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
                if ('_isComponent' in comp) {
                    comp.enabled = false;
                } else if ('active' in comp) {

                    comp.active = false;
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
     * If two state transitions overlap, a state with lower priority ( lower numeric value )
     * will be ignored.
     */
    priority: number = 0;

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

    addEnterEffect(effect: StateEffectDef) {

        if (this.onEnter) {
            this.onEnter.addEffects(effect);
        } else {
            this.onEnter = new StateEffect(effect);
        }
    }

    /**
     * Add Component to enable when entering state.
     * @param key 
     */
    addEnterEnable(key: ComponentKey) {
        if (this.onEnter) {

            this.onEnter.addEnable(key);
        } else {
            this.onEnter = new StateEffect({
                enable: [key]
            })
        }
    }

    /**
     * Add Component to disable when entering state.
     * @param key 
     */
    addEnterDisable(key: ComponentKey) {
        if (this.onEnter) {

            this.onEnter.addDisable(key);
        } else {
            this.onEnter = new StateEffect({
                disable: [key]
            })
        }
    }

    /**
 * Add Component to enable when entering state.
 * @param key 
 */
    addExitEnable(key: ComponentKey) {
        if (this.onExit) {

            this.onExit.addEnable(key);
        } else {
            this.onExit = new StateEffect({
                enable: [key]
            })
        }
    }

    /**
     * Add Component to disable when entering state.
     * @param key 
     */
    addExitDisable(key: ComponentKey) {
        if (this.onExit) {

            this.onExit.addDisable(key);
        } else {
            this.onExit = new StateEffect({
                disable: [key]
            })
        }
    }


    addExitEffect(effect: StateEffectDef) {
        if (this.onExit) {
            this.onExit.addEffects(effect);
        } else {
            this.onExit = new StateEffect(effect);
        }
    }

    /**
     * Set Enter-State Transition.
     * @param t 
     */
    setEnter(t: StateEffect | StateEffectDef) {
        this.onEnter = t instanceof StateEffect ? t : new StateEffect(t);
    }

    /**
     * Set leave-state transition.
     * @param t 
     */
    setExit(t: StateEffect | StateEffectDef) {
        this.onExit = t instanceof StateEffect ? t : new StateEffect(t);
    }

}