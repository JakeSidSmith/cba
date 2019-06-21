import { Element, Node } from '../types';

const isNodeArray = <GivenProps = {}, OwnProps = {}>(
  node: Node<GivenProps, OwnProps> | ReadonlyArray<Node> | undefined
): node is ReadonlyArray<Node> => Array.isArray(node);

const isElementArray = <GivenProps = {}>(
  element: Element<GivenProps> | ReadonlyArray<Element> | undefined
): element is ReadonlyArray<Element> => Array.isArray(element);

const flatten = <GivenProps>(
  items: ReadonlyArray<GivenProps | ReadonlyArray<GivenProps>>
): ReadonlyArray<GivenProps> =>
  items.reduce<ReadonlyArray<GivenProps>>((memo, item) => {
    const flat = Array.isArray(item)
      ? [...memo, ...flatten(item)]
      : [...memo, item];
    return flat;
  }, []);

const shallowCompare = <GivenProps = {}>(
  prev: Partial<GivenProps>,
  next: Partial<GivenProps>
) => {
  for (const key in prev) {
    if (!(key in next) || prev[key] !== next[key]) {
      return true;
    }
  }

  for (const key in next) {
    if (!(key in prev) || next[key] !== prev[key]) {
      return true;
    }
  }

  return false;
};

export { isNodeArray, isElementArray, flatten, shallowCompare };
