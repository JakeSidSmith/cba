import { ContextStore, ContextStoreSubscriber } from '../types';

export function createStore<C = {}>(initialContext: C): ContextStore<C> {
  let context = initialContext;

  const subscribers: Array<ContextStoreSubscriber<C>> = [];

  const store: ContextStore<C> = {
    subscribe: callback => {
      /* istanbul ignore else */
      if (subscribers.indexOf(callback) < 0) {
        subscribers.push(callback);
      }

      return () => {
        const index = subscribers.indexOf(callback);

        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      };
    },
    setContext: newContext => {
      context = { ...context, ...newContext };

      subscribers.forEach(subscriber => {
        subscriber(context);
      });
    },
    getContext: () => {
      return context;
    },
  };

  return store;
}
