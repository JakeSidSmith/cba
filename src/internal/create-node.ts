import Canvasimo from 'canvasimo';
import { Element, Node } from '../types';
import { ReRender } from './types';

export function createNode<
  GivenProps = {},
  OwnProps = {},
  ParentGivenProps = {},
  ParentOwnProps = {}
>(
  element: Element<GivenProps, OwnProps>,
  parentNode: Node<ParentGivenProps, ParentOwnProps> | undefined,
  canvas: Canvasimo,
  reRender: ReRender
) {
  const node: Node<GivenProps, OwnProps> = {
    element,
    state: {},
    previousProps: { ...element.props },
    previousState: {},
    rendered: undefined,
    onCreate: undefined,
    onDestroy: undefined,
    onUpdate: undefined,
    shouldUpdate: undefined,
    childTransforms: parentNode ? [...parentNode.childTransforms] : [],
    injected: {
      canvas,
      setOwnProps: state => {
        reRender(
          () => {
            node.state =
              typeof state === 'function'
                ? state({ ...node.state, ...element.props })
                : state;
          },
          () => {
            node.previousState = { ...node.state };
          }
        );
      },
      onCreate: onCreate => {
        if (!node.onCreate) {
          node.onCreate = onCreate;
        }
      },
      onUpdate: onUpdate => {
        if (!node.onUpdate) {
          node.onUpdate = onUpdate;
        }
      },
      shouldUpdate: shouldUpdate => {
        if (!node.shouldUpdate) {
          node.shouldUpdate = shouldUpdate;
        }
      },
      addChildTransform: childTransform => {
        node.childTransforms.push(childTransform);
      },
    },
  };

  return node;
}
