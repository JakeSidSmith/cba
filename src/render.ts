import Canvasimo from 'canvasimo';
import { Canvas } from './canvas';
import { createNode } from './create-node';
import { drawTree } from './draw-tree';
import { Element, Node } from './types';
import { isElementArray, isNodeArray } from './utils';

export type ReRender = (
  beforeRender: () => void,
  afterRender: () => void
) => void;

function destroyRendered<P = {}, S = {}>(
  rendered: Node<P, S> | ReadonlyArray<Node> | undefined
): void {
  if (!rendered) {
    return;
  }

  if (isNodeArray(rendered)) {
    rendered.forEach(destroyRendered);
  } else if (rendered.onDestroy) {
    rendered.onDestroy();
  }
}

export function updateTree<P = {}, S = {}>(
  next: Element<P, S>,
  prev: Node<P, S>,
  parentNode: Node | undefined,
  rootCanvas: Canvasimo,
  reRender: ReRender
): Node<P, S> {
  if (next.type === prev.element.type) {
    prev.injected.canvas
      .setSize(rootCanvas.getSize())
      .setDensity(rootCanvas.getDensity());

    if (parentNode && parentNode.childTransforms.length) {
      parentNode.childTransforms.forEach(childTransform => {
        childTransform(prev.injected.canvas);
      });
    }

    // Clear existing transforms before re-render
    prev.childTransforms = parentNode ? [...parentNode.childTransforms] : [];
    const rendered = next.type({ ...prev.state, ...next.props }, prev.injected);

    if (isElementArray(rendered)) {
      if (!isNodeArray(prev.rendered)) {
        prev.rendered = rendered.map((child, index) => {
          destroyRendered(
            (prev.rendered as ReadonlyArray<Node | undefined>)[index]
          );

          return mountTree(
            child,
            (prev as unknown) as Node,
            rootCanvas,
            reRender
          );
        });
      } else {
        prev.rendered = rendered.map((child, index) => {
          const prevChild = (prev.rendered as ReadonlyArray<Node | undefined>)[
            index
          ];

          if (!prevChild) {
            return mountTree(
              child,
              (prev as unknown) as Node,
              rootCanvas,
              reRender
            );
          }

          return updateTree(
            child,
            prevChild,
            (prev as unknown) as Node,
            rootCanvas,
            reRender
          );
        });
      }
    } else if (rendered) {
      if (isNodeArray(prev.rendered) || !prev.rendered) {
        destroyRendered(prev.rendered);

        prev.rendered = mountTree(
          rendered,
          (prev as unknown) as Node,
          rootCanvas,
          reRender
        );
      } else {
        prev.rendered = updateTree(
          rendered,
          prev.rendered,
          (prev as unknown) as Node,
          rootCanvas,
          reRender
        );
      }
    } else {
      destroyRendered(prev.rendered);
      prev.rendered = undefined;
    }

    if (prev.onUpdate) {
      prev.onUpdate(prev.previousProps);
    }

    return prev;
  } else {
    destroyRendered(prev);

    return mountTree(next, parentNode, rootCanvas, reRender);
  }
}

function renderAndMount<P = {}, S = {}>(
  element: Element<P, S>,
  node: Node<P, S>,
  parentNode: Node | undefined,
  rootCanvas: Canvasimo,
  reRender: ReRender
): Node | ReadonlyArray<Node> | undefined {
  if (parentNode && parentNode.childTransforms.length) {
    parentNode.childTransforms.forEach(childTransform => {
      childTransform(node.injected.canvas);
    });
  }

  const renderResult = element.type(element.props, node.injected);

  if (isElementArray(renderResult)) {
    return renderResult.map(child => {
      return mountTree(child, (node as unknown) as Node, rootCanvas, reRender);
    });
  }

  if (renderResult) {
    return mountTree(
      renderResult,
      (node as unknown) as Node,
      rootCanvas,
      reRender
    );
  }

  return undefined;
}

function mountTree<P = {}, S = {}>(
  element: Element<P, S>,
  parentNode: Node | undefined,
  rootCanvas: Canvasimo,
  reRender: ReRender
): Node<P, S> {
  let canvasElement: HTMLCanvasElement;
  let canvas: Canvasimo;

  // @ts-ignore
  if (element.type === Canvas) {
    canvasElement = rootCanvas.getElement();
    canvas = rootCanvas;
  } else {
    canvasElement = document.createElement('canvas');
    canvas = new Canvasimo(canvasElement)
      .setSize(rootCanvas.getSize())
      .setDensity(rootCanvas.getDensity());
  }

  const node = createNode(element, parentNode, canvas, reRender);

  node.rendered = renderAndMount(
    element,
    node,
    parentNode,
    rootCanvas,
    reRender
  );

  if (node.onCreation) {
    const onDestroy = node.onCreation();

    if (onDestroy && !node.onDestroy) {
      node.onDestroy = onDestroy;
    }
  }

  return node;
}

export function render<P = {}>(element: Element<P>, root: HTMLElement) {
  const rootCanvasElement = document.createElement('canvas');
  const rootCanvas = new Canvasimo(rootCanvasElement);

  const queuedBeforeRender: Array<() => void> = [];
  const queuedAfterRender: Array<() => void> = [];

  let queuedRender: number | undefined;
  let tree: Node<P>;

  const reRender = (beforeRender?: () => void, afterRender?: () => void) => {
    if (beforeRender) {
      queuedBeforeRender.push(beforeRender);
    }

    if (afterRender) {
      queuedAfterRender.push(afterRender);
    }

    if (typeof queuedRender === 'number') {
      window.cancelAnimationFrame(queuedRender);
    }

    queuedRender = window.requestAnimationFrame(() => {
      while (queuedBeforeRender.length) {
        const queuedUpdate = queuedBeforeRender.shift();
        if (queuedUpdate) {
          queuedUpdate();
        }
      }

      updateTree(element, tree, undefined, rootCanvas, reRender);

      rootCanvas.clearCanvas();
      drawTree(tree, rootCanvas);

      while (queuedAfterRender.length) {
        const queuedUpdate = queuedAfterRender.shift();
        if (queuedUpdate) {
          queuedUpdate();
        }
      }
    });
  };
  tree = mountTree<P>(element, undefined, rootCanvas, reRender);
  reRender();

  root.appendChild(rootCanvasElement);

  return root;
}
