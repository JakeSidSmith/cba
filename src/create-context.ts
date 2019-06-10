import { createStore } from './internal/create-store';
import { Component, Element } from './types';

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
