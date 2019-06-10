import { Element, Node } from './types';

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

export { isNodeArray, isElementArray, flatten };
