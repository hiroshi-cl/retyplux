import * as redux from "redux";
import { FSA } from "./fsa";

/**
 * Type of actions
 */
export type Actions<Payloads> = {[type in keyof Payloads]: (payload: Payloads[type]) => Payloads[type]};
/**
 * Type of reducers
 */
export type Reducers<Payloads, State> = {
    [type in keyof Payloads]: (state: State, payload: Payloads[type]) => State
};
/**
 * Options of the constructor for StoreWrapper
 */
export interface StoreOption<State> {
    /**
     * initial state
     */
    preloadedState?: State | undefined;
    /**
     * middlewares
     */
    enhancer?: redux.StoreEnhancer<State> | undefined;
}

/**
 * Type-friendly store wrapper
 */
export class StoreWrapper<Payloads, State> {
    /**
     * raw redux store
     */
    store: redux.Store<State>;

    /**
     * Create actions with methods
     *
     * For example in TODO MVC,
     * you can dispatch an 'ADD_TODO' action by `storeWrapper.actions.addTodo(text)`
     */
    actions: Actions<Payloads>;

    /**
     * Constructor.
     * If you want, handlers can be passed later. Please call register manually.
     */
    constructor(reducers: Reducers<Payloads, State>, options?: StoreOption<State>) {
        const reducer = (state: State, fsa: FSA<Payloads>) => reducers[fsa.type](state, fsa.payload);
        if (options) {
            if (options.preloadedState) {
                this.store = redux.createStore(reducer, options.preloadedState, options.enhancer);
            } else {
                this.store = redux.createStore(reducer, options.enhancer);
            }
        } else {
            this.store = redux.createStore(reducer);
        }

        for (const type in reducers) {
            this.actions[type] = (payload: Payloads[keyof Payloads]) => {
                this.store.dispatch({ type, payload });
                return payload;
            };
        }
    }
}
