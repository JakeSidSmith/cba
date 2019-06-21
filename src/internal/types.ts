import { Element, Node } from '../types';

export type ReRender = (
  beforeRender?: () => void,
  afterRender?: () => void
) => void;

export interface TreeUtils {
  mountTree: <GivenProps = {}, OwnProps = {}>(
    element: Element<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ) => Node<GivenProps, OwnProps>;
  renderAndMountTree: <GivenProps = {}, OwnProps = {}>(
    element: Element<GivenProps, OwnProps>,
    node: Node<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ) => Node | ReadonlyArray<Node> | undefined;
  updateTree: <GivenProps = {}, OwnProps = {}>(
    next: Element<GivenProps, OwnProps>,
    prev: Node<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ) => Node<GivenProps, OwnProps>;
}
