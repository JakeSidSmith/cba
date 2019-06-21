import { connect } from 'cba';
import * as createStoreModule from '../src/create-store';
import { createInjected } from './helpers/injected';

const mockStore = {
  subscribe: jest.fn(),
  setStoreState: jest.fn(),
  getStoreState: jest.fn(),
};
const mockCreateStore = jest.fn().mockReturnValue(mockStore);

jest
  .spyOn(createStoreModule, 'createStore')
  .mockImplementation(mockCreateStore);

describe('connect', () => {
  interface TestState {
    foo: string;
    baz?: number;
  }

  const initialState = { foo: 'bar' };
  const store = createStoreModule.createStore(initialState);
  const ConnectedComponent = connect<TestState, {}, TestState>(
    store,
    state => state
  )(jest.fn());

  it('returns a component', () => {
    expect(typeof ConnectedComponent).toBe('function');
    expect(ConnectedComponent.name).toBe('ConnectedComponent');
  });

  describe('ConnectedComponent', () => {
    it('calls onCreate in order to subscribe to the store, returning the un-subscriber', () => {
      const injected = createInjected<{}, TestState>();
      ConnectedComponent({}, injected);

      expect(injected.onCreate).toHaveBeenCalledTimes(1);

      const [onCreateCall] = (injected.onCreate as jest.Mock).mock.calls;

      expect(onCreateCall.length).toBe(1);
      expect(typeof onCreateCall[0]).toBe('function');
      expect(mockStore.subscribe).toHaveBeenCalledTimes(0);

      onCreateCall[0]();

      expect(mockStore.subscribe).toHaveBeenCalledTimes(1);

      const [subscribeCall] = mockStore.subscribe.mock.calls;

      expect(subscribeCall.length).toBe(1);
      expect(typeof subscribeCall[0]).toBe('function');

      expect(injected.setOwnProps).toHaveBeenCalledTimes(0);

      subscribeCall[0]();

      expect(injected.setOwnProps).toHaveBeenCalledTimes(1);
    });
  });
});
