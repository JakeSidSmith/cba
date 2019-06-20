import Canvasimo from 'canvasimo';
import { Canvas } from '../canvas';
import { Element, Node } from '../types';
import { createNode } from './create-node';
import { destroyTree } from './destroy-tree';
import { ReRender, TreeUtils } from './types';
import { isElementArray, isNodeArray, shallowCompare } from './utils';

export function createTreeUtils(
  rootCanvas: Canvasimo,
  reRender: ReRender
): TreeUtils {
  const treeUtils = {} as TreeUtils;

  treeUtils.mountTree = function mountTree<P = {}, S = {}>(
    element: Element<P, S>,
    parentNode: Node | undefined
  ): Node<P, S> {
    let canvasElement: HTMLCanvasElement;
    let canvas: Canvasimo;

    // @ts-ignore
    if (element.type === Canvas) {
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

    if (node.onCreation) {
      const onDestroy = node.onCreation();

      /* istanbul ignore else */
      if (onDestroy && !node.onDestroy) {
        node.onDestroy = onDestroy;
      }
    }

    return node;
  };

  treeUtils.renderAndMountTree = function renderAndMountTree<P = {}, S = {}>(
    element: Element<P, S>,
    node: Node<P, S>,
    parentNode: Node | undefined
  ): Node | ReadonlyArray<Node> | undefined {
    if (parentNode && parentNode.childTransforms.length) {
      parentNode.childTransforms.forEach(childTransform => {
        childTransform(node.injected.canvas);
      });
    }

    const renderResult = element.type(element.props, node.injected);

    if (isElementArray(renderResult)) {
      return renderResult.map(child => {
        return treeUtils.mountTree(child, (node as unknown) as Node);
      });
    }

    if (renderResult) {
      return treeUtils.mountTree(renderResult, (node as unknown) as Node);
    }

    return undefined;
  };

  treeUtils.updateTree = function updateTree<P = {}, S = {}>(
    next: Element<P, S>,
    prev: Node<P, S>,
    parentNode: Node | undefined
  ): Node<P, S> {
    if (next.type === prev.element.type) {
      if (
        (typeof prev.shouldUpdate === 'undefined' &&
          shallowCompare(prev.previousProps, next.props)) ||
        (typeof prev.shouldUpdate === 'function' &&
          prev.shouldUpdate(prev.previousProps)) ||
        prev.shouldUpdate
      ) {
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
        const rendered = next.type(
          { ...prev.state, ...next.props },
          prev.injected
        );

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
        } else {
          prev.rendered = undefined;
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
