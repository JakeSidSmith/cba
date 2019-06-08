import { Component, Element } from './types';

export function createElement<P = {}>(
  type: Component<P>,
  props: P,
  ...children: ReadonlyArray<Element>
): Element<P> {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
