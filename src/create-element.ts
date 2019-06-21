import { flatten } from './internal/utils';
import { Component, Element } from './types';

export function createElement<GivenProps = {}, OwnProps = {}>(
  type: Component<GivenProps, OwnProps>,
  props: GivenProps,
  ...children: ReadonlyArray<Element>
): Element<GivenProps, OwnProps> {
  return {
    type,
    props: {
      ...props,
      children: flatten(children),
    },
  };
}
