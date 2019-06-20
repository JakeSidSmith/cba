import { Store, StoreSubscriber } from './types';

export function createStore<C = {}>(initialContext: C): Store<C> {
  let context = initialContext;

  const subscribers: Array<StoreSubscriber<C>> = [];

  const store: Store<C> = {
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
    setStoreState: newContext => {
      context = { ...context, ...newContext };

      subscribers.forEach(subscriber => {
        subscriber(context);
      });
    },
    getStoreState: () => {
      return context;
    },
  };

  return store;
}
