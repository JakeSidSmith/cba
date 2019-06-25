import {
  CONTEXT_CONSUMER_TYPE,
  CONTEXT_PROVIDER_TYPE,
} from './internal/constants';
import { ContextConsumerComponent, ContextProviderComponent } from './types';

let contextIdCounter = 0;

const createContext = <Context = {}>(initialContext: Context) => {
  const contextId = contextIdCounter;

  const ContextProvider: ContextProviderComponent<Context> = (
    { children, ...props },
    setContext
  ) => {
    setContext(contextId, initialContext, props);

    return children;
  };

  ContextProvider._type = CONTEXT_PROVIDER_TYPE;
  ContextProvider._contextId = contextId;

  const ContextConsumer: ContextConsumerComponent<Context> = (
    { children },
    context
  ) => {
    if (Array.isArray(children) && typeof children[0] === 'function') {
      return children[0](context);
    }

    return undefined;
  };

  ContextConsumer._type = CONTEXT_CONSUMER_TYPE;
  ContextConsumer._contextId = contextId;

  contextIdCounter += 1;

  return {
    ContextConsumer,
    ContextProvider,
  };
};

export { createContext };
