import { flatten } from './internal/utils';
import { ComponentType, Element } from './types';

export function createElement<GivenProps = {}, OwnProps = {}>(
  type: ComponentType<GivenProps, OwnProps>,
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
