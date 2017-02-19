import * as flux from "flux";
import { FSA } from "./fsa";

/**
 * Type of actions
 */
export type Actions<Payloads> = {[type in keyof Payloads]: (payload: Payloads[type]) => void};
/**
 * Type of handlers (in flux, this equals to Actions<>)
 */
export type Handlers<Payloads> = Actions<Payloads>;

/**
 * Type-friendly local wrapper for the global dispatcher
 */
export class LocalDispatcher<Payloads> {
    /**
     * Create actions with methods
     *
     * For example in TODO MVC,
     * you can dispatch an 'ADD_TODO' action by `localDispatcher.actions.addTodo(text)`
     */
    actions: Actions<Payloads>;

    /**
     * Constructor.
     * If you want, handlers can be passed later. Please call register manually.
     */
    constructor(public dispatcher: flux.Dispatcher<FSA<Payloads>>, handlers?: Handlers<Payloads> | undefined) {
        if (handlers) {
            this.register(handlers);
        }
    }

    /**
     * Register handler after the instantiation of this object.
     * You can choose an alternative to register in the constructor.
     */
    register(handlers: Handlers<Payloads>) {
        this.dispatcher.register((fsa: FSA<Payloads>) => handlers[fsa.type](fsa.payload));
        for (const type in handlers) {
            this.actions[type] = (payload: Payloads[keyof Payloads]) => {
                this.dispatcher.dispatch({ type, payload });
            };
        }
    }
}
