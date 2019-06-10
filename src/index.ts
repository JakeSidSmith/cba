export * from './types';

import { Canvas, CanvasProps } from './canvas';
import { ConsumerProps, createContext, ProviderProps } from './create-context';
import { createElement } from './create-element';
import { render } from './render';

export {
  Canvas,
  createContext,
  createElement,
  render,
  // Types
  CanvasProps,
  ConsumerProps,
  ProviderProps,
};

export default {
  Canvas,
  createContext,
  createElement,
  render,
};
