import { Element, Node } from '../types';

export type ReRender = (
  beforeRender?: () => void,
  afterRender?: () => void
) => void;

export interface TreeUtils {
  mountTree: <P = {}, S = {}>(
    element: Element<P, S>,
    parentNode: Node | undefined
  ) => Node<P, S>;
  renderAndMountTree: <P = {}, S = {}>(
    element: Element<P, S>,
    node: Node<P, S>,
    parentNode: Node | undefined
  ) => Node | ReadonlyArray<Node> | undefined;
  updateTree: <P = {}, S = {}>(
    next: Element<P, S>,
    prev: Node<P, S>,
    parentNode: Node | undefined
  ) => Node<P, S>;
}
