import { Component } from './component';
import { State, Transition } from '../data/state';


/**
 * Basis State Machine for adding/removing components on state changes.
 */
export class FSM extends Component {

    private _startState: State;

    private readonly _states: Map<string, State> = new Map();

    public get current() { return this._current; }
    private _current: State;

    /**
     * True if state is changing. Used to detect
     * multiple simultaneous state changes.
     */
    private _changing = false;

    constructor(start?: State) {

        super();

        this._startState = start ?? new State('default');
        this._current = this._startState;

    }

    /**
     * Trigger transition on current state.
     * @param trigger 
     */
    trigger(trigger: string) {

        const next = this._current.trigger(trigger);
        if (next) {
            const state = this.getState(next);
            if (state) {
                this.switchState(state);
            }
        }
    }

    /**
     * Switch to new state, triggering exit and enter transitions.
     * @param newState 
     */
    switchState(newState: State) {

        if (this._changing) {
            throw new Error(`Conflicting State Change: ${newState.name}`);
        }
        this._changing = true;

        if (this._current.onExit) {
            this._onTransition(this._current.onExit);
        }

        this._current = newState;
        if (newState.onEnter) {
            this._onTransition(newState
                .onEnter);
        }

        this._changing = false;

    }

    _onTransition(t: Transition) {

        const remove = t.toRemove;
        for (let i = 0; i < remove.length; i++) {
            this.actor!.remove(remove[i]);
        }

        const add = t.toAdd;
        for (let i = 0; i < add.length; i++) {

            const comp = add[i];
            if (comp instanceof Component) {
                this.actor!.add(comp);
            } else {
                this.actor!.require(comp);
            }
        }

    }

    getState(name: string) {
        return this._states.get(name);
    }

    /**
     * Set current state without triggering transitions.
     * @param name 
     */
    setState(name: string) {

        const state = this._states.get(name);
        if (state) {
            this._current = state;
        }

    }

    /**
     * Create and return new state of FSM.
     * @param name 
     * @returns 
     */
    createState(name: string) {

        if (this._states.has(name)) {
            return false;
        } else {

            const st = new State(name);
            this._states.set(name, st);

            return st;
        }

    }

    /**
     * Set FSM Start State.
     * @param state 
     */
    setStart(state: State | string) {

        if (typeof state === 'string') {

            const st = this._states.get(state);
            if (st) {
                this._startState = st;
            }

        } else {
            this.addState(state);
            this._startState = state;
        }

    }

    addState(state: State) {
        this._states.set(state.name, state);
    }

}