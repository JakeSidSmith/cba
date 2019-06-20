import { Element, Node } from '../types';

const isNodeArray = <P = {}, S = {}>(
  node: Node<P, S> | ReadonlyArray<Node> | undefined
): node is ReadonlyArray<Node> => Array.isArray(node);

const isElementArray = <P = {}>(
  element: Element<P> | ReadonlyArray<Element> | undefined
): element is ReadonlyArray<Element> => Array.isArray(element);

const flatten = <P>(
  items: ReadonlyArray<P | ReadonlyArray<P>>
): ReadonlyArray<P> =>
  items.reduce<ReadonlyArray<P>>((memo, item) => {
    const flat = Array.isArray(item)
      ? [...memo, ...flatten(item)]
      : [...memo, item];
    return flat;
  }, []);

const shallowCompare = <P = {}>(prev: Partial<P>, next: Partial<P>) => {
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
