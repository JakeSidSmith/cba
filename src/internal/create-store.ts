import { ContextStore } from 'src/types';

export function createStore<C = {}>(initialContext: C): ContextStore<C> {
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
