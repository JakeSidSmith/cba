import { Component, Element } from './types';
import { flatten } from './utils';

export function createElement<P = {}>(
  type: Component<P>,
  props: P,
  ...children: ReadonlyArray<Element>
): Element<P> {
  return {
    type,
    props: {
      ...props,
      children: flatten(children),
    },
  };
}
