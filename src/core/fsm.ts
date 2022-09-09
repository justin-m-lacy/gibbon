import { State } from '../data/state';
import { Component } from './component';

export enum StateEvent {
    enter = 'enterState',
    exit = 'exitState'
}

/**
 * Basis State Machine for adding/removing components on state changes.
 */
export class FSM<TKey = string | Symbol | number> extends Component {

    private _startState: State<TKey>;

    private readonly _states: Map<TKey, State<TKey>> = new Map();

    public get current() { return this._current; }
    private _current: State<TKey>;

    /**
     * True if state is changing. Used to detect
     * multiple simultaneous state changes.
     */
    private _changing = false;

    constructor(start: State<TKey> | TKey) {

        super();

        this._startState = start instanceof State ? start : new State<TKey>(start);

        this.addState(this._startState);

        this._current = this._startState;

    }

    /**
     * Trigger transition on current state.
     * @param trigger 
     */
    trigger(trigger: string) {

        const next = this._current.getNextState(trigger);
        if (next) {
            const state = this.getState(next);
            if (state) {
                this.switchState(state);
            }
        }
    }

    /**
     * Switch to new state, triggering exit and enter transitions
     * from current and next states respectively.
     * @param newState 
     */
    switchState(newState: State<TKey>) {

        if (this._changing) {
            throw new Error(`Overlapping State Change: ${newState.name}`);
        } else if (!this.actor) {
            throw new Error(`Attempting to change state with no actor: ${newState.name}`)
        }
        this._changing = true;
        this._current.onExit?.apply(this.actor!);
        this.actor?.emit(StateEvent.exit, this._current);


        this._current = newState;
        newState.onEnter?.apply(this.actor!);
        this.actor!.emit(StateEvent.enter, newState);

        this._changing = false;

    }

    getState(name: TKey) {
        return this._states.get(name);
    }

    /**
     * Set current state without triggering transitions.
     * @param name 
     */
    setState(name: TKey) {

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
    createState(name: TKey) {

        if (this._states.has(name)) {
            return false;
        } else {

            const st = new State<TKey>(name);
            this._states.set(name, st);

            return st;
        }

    }

    /**
     * Set FSM Start State.
     * @param state 
     */
    setStart(state: State<TKey> | TKey) {

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

    addState(state: State<TKey>) {
        this._states.set(state.name, state);
    }

}