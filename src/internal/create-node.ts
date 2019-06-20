import Canvasimo from 'canvasimo';
import { Element, Node } from '../types';
import { ReRender } from './types';

export function createNode<P = {}, S = {}>(
  element: Element<P, S>,
  parentNode: Node | undefined,
  canvas: Canvasimo,
  reRender: ReRender
) {
  const node: Node<P, S> = {
    element,
    previousProps: element.props,
    rendered: undefined,
    onCreation: undefined,
    onDestroy: undefined,
    onUpdate: undefined,
    shouldUpdate: undefined,
    state: {},
    childTransforms: parentNode ? [...parentNode.childTransforms] : [],
    injected: {
      canvas,
      setState: state => {
        reRender(
          () => {
            node.state =
              typeof state === 'function'
                ? state({ ...node.state, ...element.props })
                : state;
          },
          () => {
            node.previousProps = { ...node.state, ...element.props };
          }
        );
      },
      onCreation: onCreation => {
        if (!node.onCreation) {
          node.onCreation = onCreation;
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
