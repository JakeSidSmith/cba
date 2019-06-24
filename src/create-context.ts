import {
  CONTEXT_CONSUMER_TYPE,
  CONTEXT_PROVIDER_TYPE,
} from './internal/constants';
import { ContextConsumerComponent, ContextProviderComponent } from './types';

const contextId = 0;

const createContext = <Context = {}>() => {
  const ContextProvider: ContextProviderComponent<Context> = () => {};

  ContextProvider._type = CONTEXT_PROVIDER_TYPE;
  ContextProvider._contextId = contextId;

  const ContextConsumer: ContextConsumerComponent<Context> = () => {};

  ContextConsumer._type = CONTEXT_CONSUMER_TYPE;
  ContextConsumer._contextId = contextId;

  return {
    ContextConsumer,
    ContextProvider,
  };
};

export { createContext };
