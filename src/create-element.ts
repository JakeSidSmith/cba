import { Component, Element } from './types';

const flatten = <P>(
  items: ReadonlyArray<P | ReadonlyArray<P>>
): ReadonlyArray<P> => {
  return items.reduce<ReadonlyArray<P>>((memo, item) => {
    const flat = Array.isArray(item)
      ? [...memo, ...flatten(item)]
      : [...memo, item];
    return flat;
  }, []);
};

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
