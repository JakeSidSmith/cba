import { Element, Node } from './types';

export const isNodeArray = <P = {}, S = {}>(
  node: Node<P, S> | ReadonlyArray<Node> | undefined
): node is ReadonlyArray<Node> => Array.isArray(node);

export const isElementArray = <P = {}>(
  element: Element<P> | ReadonlyArray<Element> | undefined
): element is ReadonlyArray<Element> => Array.isArray(element);
