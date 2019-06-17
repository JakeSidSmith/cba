import {
  ConsumerProps,
  ConsumerState,
  createContext,
  createElement,
  Element,
} from 'cba';
import * as createStoreModule from '../src/internal/create-store';
import { createInjected } from './helpers/injected';

const mockStore = {
  subscribe: jest.fn(),
  setContext: jest.fn(),
  getContext: jest.fn(),
};
const mockCreateStore = jest.fn().mockReturnValue(mockStore);

jest
  .spyOn(createStoreModule, 'createStore')
  .mockImplementation(mockCreateStore);

describe('createContext', () => {
  interface TestState {
    foo: string;
    baz?: number;
  }

  const initialContext = { foo: 'bar' };
  const TestContext = createContext<TestState>(initialContext);

  it('should create a store and return Provider and Consumer components', () => {
    expect(mockCreateStore).toHaveBeenCalledTimes(1);
    expect(mockCreateStore).toHaveBeenCalledWith(initialContext);
  });

  describe('Provider', () => {
    it('calls setContext with the provided context', () => {
      const context = { foo: 'not foo', baz: 7 };
      TestContext.Provider({ context }, createInjected());

      expect(mockStore.setContext).toHaveBeenCalledTimes(1);
      expect(mockStore.setContext).toHaveBeenCalledWith(context);
    });
  });

  describe('Consumer', () => {
    it('returns undefined when no children are present', () => {
      const context = { foo: 'not foo', baz: 7 };
      const injected = createInjected<
        ConsumerProps<TestState>,
        ConsumerState<TestState>
      >();
      const returned = TestContext.Consumer(
        { children: undefined, context },
        injected
      );

      expect(returned).toBe(undefined);
    });

    it('calls getContext when no context is present', () => {
      const injected = createInjected<
        ConsumerProps<TestState>,
        ConsumerState<TestState>
      >();
      TestContext.Consumer(
        { children: undefined, context: undefined },
        injected
      );

      expect(mockStore.getContext).toHaveBeenCalledTimes(1);
    });

    it('calls onCreation in order to subscribe to the store, returning the un-subscriber', () => {
      const context = { foo: 'not foo', baz: 7 };
      const element = createElement(() => undefined, {});
      const children: [(context: TestState) => Element] = [
        jest.fn().mockImplementation(() => element),
      ];
      const injected = createInjected<
        ConsumerProps<TestState>,
        ConsumerState<TestState>
      >();
      const returned = TestContext.Consumer({ children, context }, injected);

      expect(children[0]).toHaveBeenCalledTimes(1);
      expect(children[0]).toHaveBeenCalledWith(context);

      expect(injected.onCreation).toHaveBeenCalledTimes(1);
      expect(returned).toBe(element);

      const [onCreationCall] = (injected.onCreation as jest.Mock).mock.calls;

      expect(onCreationCall.length).toBe(1);
      expect(typeof onCreationCall[0]).toBe('function');
      expect(mockStore.subscribe).toHaveBeenCalledTimes(0);

      onCreationCall[0]();

      expect(mockStore.subscribe).toHaveBeenCalledTimes(1);

      const [subscribeCall] = mockStore.subscribe.mock.calls;

      expect(subscribeCall.length).toBe(1);
      expect(typeof subscribeCall[0]).toBe('function');

      expect(injected.setState).toHaveBeenCalledTimes(0);

      subscribeCall[0]();

      expect(injected.setState).toHaveBeenCalledTimes(1);
    });
  });
});
