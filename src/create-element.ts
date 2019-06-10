import { flatten } from './internal/utils';
import { Component, Element } from './types';

export function createElement<P = {}, S = {}>(
  type: Component<P, S>,
  props: P,
  ...children: ReadonlyArray<Element>
): Element<P, S> {
  return {
    type,
    props: {
      ...props,
      children: flatten(children),
    },
  };
}
