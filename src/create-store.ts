import { Store, StoreSubscriber } from './types';

export function createStore<StoreState = {}>(
  initialState: StoreState
): Store<StoreState> {
  let state = initialState;

  const subscribers: Array<StoreSubscriber<StoreState>> = [];

  const store: Store<StoreState> = {
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
    setStoreState: newState => {
      state = { ...state, ...newState };

      subscribers.forEach(subscriber => {
        subscriber(state);
      });
    },
    getStoreState: () => {
      return state;
    },
  };

  return store;
}
