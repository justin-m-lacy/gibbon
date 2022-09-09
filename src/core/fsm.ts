import { Component } from './component';
import { State } from '../data/state';

export class FSM extends Component {

    private _startState: State;

    private readonly _states: Map<string, State> = new Map();

    public get current() { return this._current; }
    private _current: State;

    constructor(start?: State) {

        super();

        this._startState = start ?? new State('default');
        this._current = this._startState;

    }

    _exitState(state: State) {

        if (state.onExit) {

            const remove = state.onExit.toRemove;
            for (let i = 0; i < remove.length; i++) {
                this.actor!.remove(remove[i]);
            }

            const add = state.onExit.toAdd;
            for (let i = 0; i < add.length; i++) {

                const comp = add[i];
                if (comp instanceof Component) {
                    this.actor!.add(comp);
                } else {
                    this.actor!.require(comp);
                }
            }

        }

    }

    getState(name: string) {
        return this._states.get(name);
    }

    setState(name: string) {

        const state = this._states.get(name);
        if (state) {
            this._current = state;
        }

    }

    setStartState(state: State | string) {

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