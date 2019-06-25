import Canvasimo from 'canvasimo';
import { Element, Node } from '../types';
import {
  CANVAS_TYPE,
  CONTEXT_CONSUMER_TYPE,
  CONTEXT_PROVIDER_TYPE,
} from './constants';
import { createNode } from './create-node';
import { destroyTree } from './destroy-tree';
import { ReRender, TreeUtils } from './types';
import { isElementArray, isNodeArray, shallowCompare } from './utils';

export function createTreeUtils(
  rootCanvas: Canvasimo,
  reRender: ReRender
): TreeUtils {
  const contexts: Record<string, unknown> = {};
  const treeUtils = {} as TreeUtils;

  const setContext = (
    contextId: number,
    initialContext: unknown,
    context: unknown
  ) => {
    contexts[contextId] = {
      ...initialContext,
      ...contexts[contextId],
      ...context,
    };
  };

  treeUtils.mountTree = function mountTree<GivenProps = {}, OwnProps = {}>(
    element: Element<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ): Node<GivenProps, OwnProps> {
    let canvasElement: HTMLCanvasElement;
    let canvas: Canvasimo;

    if (element.type._type === CANVAS_TYPE) {
      canvasElement = rootCanvas.getElement();
      canvas = rootCanvas;
    } else {
      const { width, height } = rootCanvas.getSize();

      canvasElement = document.createElement('canvas');
      canvas = new Canvasimo(canvasElement)
        .setSize(width, height)
        .setDensity(rootCanvas.getDensity());
    }

    const node = createNode(element, parentNode, canvas, reRender);

    node.rendered = treeUtils.renderAndMountTree(element, node, parentNode);

    if (node.onCreate) {
      const onDestroy = node.onCreate();

      /* istanbul ignore else */
      if (onDestroy && !node.onDestroy) {
        node.onDestroy = onDestroy;
      }
    }

    return node;
  };

  treeUtils.renderAndMountTree = function renderAndMountTree<
    GivenProps = {},
    OwnProps = {}
  >(
    element: Element<GivenProps, OwnProps>,
    node: Node<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ): Node | ReadonlyArray<Node> | undefined {
    if (parentNode && parentNode.childTransforms.length) {
      parentNode.childTransforms.forEach(childTransform => {
        childTransform(node.injected.canvas);
      });
    }

    let rendered: Element | ReadonlyArray<Element> | undefined;

    if (element.type._type === CONTEXT_PROVIDER_TYPE) {
      rendered = element.type(element.props, setContext);
    } else if (element.type._type === CONTEXT_CONSUMER_TYPE) {
      rendered = element.type(element.props, contexts[
        element.type._contextId
      ] as GivenProps);
    } else {
      rendered = element.type(element.props, node.injected);
    }

    if (isElementArray(rendered)) {
      return rendered.map(child => {
        return treeUtils.mountTree(child, (node as unknown) as Node);
      });
    }

    if (rendered) {
      return treeUtils.mountTree(rendered, (node as unknown) as Node);
    }

    return undefined;
  };

  treeUtils.updateTree = function updateTree<GivenProps = {}, OwnProps = {}>(
    next: Element<GivenProps, OwnProps>,
    prev: Node<GivenProps, OwnProps>,
    parentNode: Node | undefined
  ): Node<GivenProps, OwnProps> {
    if (next.type === prev.element.type) {
      if (
        prev.shouldUpdate === true ||
        (typeof prev.shouldUpdate === 'undefined' &&
          shallowCompare(
            { ...prev.previousState, ...prev.previousProps },
            { ...prev.state, ...next.props }
          )) ||
        (typeof prev.shouldUpdate === 'function' &&
          prev.shouldUpdate({
            ...prev.previousState,
            ...prev.previousProps,
          }))
      ) {
        // Update element
        prev.element = next;

        const { width, height } = rootCanvas.getSize();

        prev.injected.canvas
          .setSize(width, height)
          .setDensity(rootCanvas.getDensity());

        if (parentNode && parentNode.childTransforms.length) {
          parentNode.childTransforms.forEach(childTransform => {
            childTransform(prev.injected.canvas);
          });
        }

        // Clear existing transforms before re-render
        prev.childTransforms = parentNode
          ? [...parentNode.childTransforms]
          : [];

        let rendered: Element | ReadonlyArray<Element> | undefined;

        if (next.type._type === CONTEXT_PROVIDER_TYPE) {
          rendered = next.type(next.props, setContext);
        } else if (next.type._type === CONTEXT_CONSUMER_TYPE) {
          rendered = next.type(next.props, contexts[
            next.type._contextId
          ] as GivenProps);
        } else {
          rendered = next.type({ ...prev.state, ...next.props }, prev.injected);
        }

        const { rendered: prevRendered } = prev;

        if (isElementArray(rendered)) {
          if (isNodeArray(prevRendered)) {
            prev.rendered = rendered.map((child, index) => {
              const prevChild = prevRendered[index];

              if (!prevChild) {
                return treeUtils.mountTree(child, (prev as unknown) as Node);
              }

              return treeUtils.updateTree(
                child,
                prevChild,
                (prev as unknown) as Node
              );
            });
          } else {
            destroyTree(prevRendered);

            prev.rendered = rendered.map(child => {
              return treeUtils.mountTree(child, (prev as unknown) as Node);
            });
          }
        } else if (rendered) {
          if (isNodeArray(prevRendered) || !prevRendered) {
            destroyTree(prevRendered);

            prev.rendered = treeUtils.mountTree(
              rendered,
              (prev as unknown) as Node
            );
          } else {
            prev.rendered = treeUtils.updateTree(
              rendered,
              prevRendered,
              (prev as unknown) as Node
            );
          }
        } else {
          destroyTree(prevRendered);
          prev.rendered = undefined;
        }

        if (prev.onUpdate) {
          prev.onUpdate(prev.previousProps);
        }

        // Update previous props
        prev.previousProps = { ...next.props };

        return prev;
      } else {
        if (isNodeArray(prev.rendered)) {
          prev.rendered = prev.rendered.map(child => {
            return treeUtils.updateTree(
              child.element,
              child,
              (prev as unknown) as Node
            );
          });
        } else if (prev.rendered) {
          prev.rendered = treeUtils.updateTree(
            prev.rendered.element,
            prev.rendered,
            (prev as unknown) as Node
          );
        }

        return prev;
      }
    } else {
      destroyTree(prev);

      return treeUtils.mountTree(next, parentNode);
    }
  };

  return treeUtils;
}
