import { createStore } from '../../src/internal/create-store';

describe('createStore', () => {
  interface StoreState {
    foo: string;
    baz?: number;
  }

  const store = createStore<StoreState>({ foo: 'bar' });

  describe('getContext', () => {
    it('returns the store state', () => {
      expect(store.getContext()).toEqual({ foo: 'bar' });
    });
  });

  describe('setContext', () => {
    it('updates the existing store state', () => {
      store.setContext({ baz: 7 });

      expect(store.getContext()).toEqual({ foo: 'bar', baz: 7 });
    });
  });

  describe('subscribe', () => {
    it('allows subscribing to changes to the store state, and un-subscribing with the returned function', () => {
      const listener = jest.fn();

      const unSubscribe = store.subscribe(listener);

      store.setContext({ baz: 3 });

      expect(listener).toHaveBeenCalledTimes(1);
      const [firstCall] = listener.mock.calls;

      expect(firstCall.length).toBe(1);
      expect(firstCall[0]).toEqual({ foo: 'bar', baz: 3 });

      unSubscribe();

      store.setContext({ foo: 'not bar' });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.getContext()).toEqual({ foo: 'not bar', baz: 3 });

      // Covers un-subscribing when already un-subscribed
      unSubscribe();
    });
  });
});
