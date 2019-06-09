import { Component, ContextStore, Element } from './types';

export interface ProviderProps<C = {}> {
  context: C;
}

export interface ConsumerProps<C = {}> {
  children?: [
    (context: C) => Element | ReadonlyArray<Element> | undefined,
    Element
  ];
}

export interface ConsumerState<C> {
  context: C;
}

function createStore<C = {}>(initialContext: C): ContextStore<C> {
  let context = initialContext;

  const store: ContextStore<C> = {
    subscribers: [],
    subscribe: callback => {
      store.subscribers.push(callback);

      return () => {
        const index = store.subscribers.indexOf(callback);

        if (index >= 0) {
          store.subscribers.splice(index, 1);
        }
      };
    },
    setContext: (newContext: C) => {
      context = newContext;

      store.subscribers.forEach(subscriber => {
        subscriber(context);
      });
    },
    getContext: () => {
      return context;
    },
  };

  return store;
}

export function createContext<C = {}>(initialContext: C) {
  const store = createStore(initialContext);

  const Provider: Component<ProviderProps<C>> = ({ context, children }) => {
    store.setContext(context);

    return children;
  };

  const Consumer: Component<ConsumerProps<C>, ConsumerState<C>> = (
    { context = store.getContext(), children },
    { onCreation, setState }
  ) => {
    onCreation(() => {
      return store.subscribe(newContext => {
        setState({ context: newContext });
      });
    });

    if (children && children.length && context) {
      return children[0](context);
    }

    return undefined;
  };

  return {
    Provider,
    Consumer,
  };
}
