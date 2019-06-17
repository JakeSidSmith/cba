import { createStore } from './internal/create-store';
import {
  Component,
  ConsumerProps,
  ConsumerState,
  Element,
  ProviderProps,
} from './types';

export function createContext<C = {}>(initialContext: C) {
  const store = createStore(initialContext);

  const Provider: Component<ProviderProps<C>, {}, Element> = ({
    context,
    children,
  }) => {
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
