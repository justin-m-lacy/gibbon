
import { Component } from './component';
import { State, Transition } from '../data/state';
import type { StateEffect, StateEffectDef } from '../data/state';

export enum StateEvent {
    enter = 'enterState',
    exit = 'exitState'
}

/**
 * Basis State Machine for adding/removing components on state changes.
 */
export class FSM<TKey = string | Symbol | number, TTrigger = string | Symbol> extends Component {

    private _startState: State<TKey, TTrigger>;

    private readonly _states: Map<TKey, State<TKey, TTrigger>> = new Map();

    public get current() { return this._current; }
    private _current: State<TKey, TTrigger>;

    /**
     * True if state is changing. Used to detect
     * multiple simultaneous state changes.
     */
    private _changing = false;

    /**
     * Current transition for timed transitions.
     */
    private curTransition: Transition<TKey> | null = null;
    /**
     * Timer on current transition.
     */
    private transTimer: number = 0;

    constructor(start: State<TKey, TTrigger> | TKey) {

        super();

        this._startState = start instanceof State ? start : new State<TKey, TTrigger>(start);

        this.addState(this._startState);

        this._current = this._startState;

    }

    init() {
        this.enterState(this._current);
    }

    /**
     * Trigger transition on current state.
     * @param trigger
     * @returns new State or false on error.
     */
    trigger(trigger: TTrigger) {

        const next = this._current.getNextState(trigger);
        if (next) {
            return this.switchState(next);
        }
        return false;
    }

    /**
     * Switch to new state, triggering exit and enter transitions
     * from current and next states respectively.
     * @param newState
     * @throws Error if state change already in progress, or attempting to change state
     * on an FSM not initialized with an Actor.
     * @returns new State<TKey> or false on failure.
     */
    switchState(stateName: TKey) {

        if (this._changing) {
            throw new Error(`Overlapping State Change: ${stateName}`);
        } else if (!this.actor) {
            throw new Error(`Attempting to change state with no actor: ${stateName}`)
        } else if (stateName === this._current.name) {
            // No state change.
            return false;
        }

        this._changing = true;
        this.curTransition = null;

        const newState = this.getState(stateName);

        if (newState) {

            this._current.onExit?.apply(this.actor!);
            this.actor?.emit(StateEvent.exit, this._current);

            this.enterState(newState);

            return newState;
        }
        this._changing = false;
        return false;

    }

    private enterState(newState: State<TKey, TTrigger>) {

        this._current = newState;
        newState.onEnter?.apply(this.actor!);
        this.actor!.emit(StateEvent.enter, newState);

        if (newState.autoNext) {
            this.curTransition = newState.autoNext;
            this.transTimer = newState.autoNext.enterTime;
        }



    }

    update(delta: number) {

        if (this.curTransition) {

            this.transTimer -= delta;
            if (this.transTimer <= 0) {
                this.switchState(this.curTransition.dest);
            }

        }

    }


    getState(name: TKey) {
        return this._states.get(name);
    }

    /**
     * Returns true if the current state responds
     * to trigger.
     * @param trigger 
     */
    canTrigger(trigger: TTrigger) {
        return this.current.canTrigger(trigger);
    }


    /**
     * Set current state without triggering transitions.
     * @param name 
     */
    setState(name: TKey) {

        const state = this._states.get(name);
        if (state) {
            this.enterState(state);
        }

    }

    /**
     * Create and return new state of FSM.
     * @param name 
     * @returns 
     */
    createState(name: TKey, opts?: { onEnter?: StateEffect | StateEffectDef, onExit?: StateEffect | StateEffectDef }) {

        if (this._states.has(name)) {
            return false;
        } else {

            const st = new State<TKey, TTrigger>(name, opts);
            this._states.set(name, st);

            return st;
        }

    }

    /**
     * Set FSM Start State.
     * @param state 
     */
    setStart(state: State<TKey, TTrigger> | TKey) {

        if (state instanceof State) {
            this.addState(state);
            this._startState = state;

        } else {
            const st = this._states.get(state);
            if (st) {
                this._startState = st;
            }

        }

    }

    addState(state: State<TKey, TTrigger>) {
        this._states.set(state.name, state);
    }

}