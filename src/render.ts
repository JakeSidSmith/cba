import Canvasimo from 'canvasimo';
import { Canvas } from './canvas';
import { drawTree } from './draw-tree';
import { Element, Node } from './types';
import { isElementArray, isNodeArray } from './utils';

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
  reRender: () => void
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
    const rendered = next.type(next.props, prev.injected);

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
      window.requestAnimationFrame(() => {
        if (prev.onUpdate) {
          prev.onUpdate(prev.previousProps);
        }
      });
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
  reRender: () => void
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
  reRender: () => void
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

  const node: Node<P, S> = {
    element,
    previousProps: { ...element.props },
    rendered: undefined,
    onCreation: undefined,
    onDestroy: undefined,
    onUpdate: undefined,
    childTransforms: parentNode ? [...parentNode.childTransforms] : [],
    injected: {
      canvas,
      setState: state => {
        const nextState =
          typeof state === 'function' ? state(element.props) : state;
        node.element.props = { ...node.previousProps, ...nextState };

        updateTree(element, node, parentNode, rootCanvas, reRender);
        reRender();

        node.previousProps = element.props;
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
      addChildTransform: childTransform => {
        node.childTransforms.push(childTransform);
      },
    },
  };

  node.rendered = renderAndMount(
    element,
    node,
    parentNode,
    rootCanvas,
    reRender
  );

  if (node.onCreation) {
    window.requestAnimationFrame(() => {
      if (node.onCreation) {
        const onDestroy = node.onCreation();

        if (onDestroy && !node.onDestroy) {
          node.onDestroy = onDestroy;
        }
      }
    });
  }

  return node;
}

export function render<P = {}>(element: Element<P>, root: HTMLElement) {
  const rootCanvasElement = document.createElement('canvas');
  const rootCanvas = new Canvasimo(rootCanvasElement);

  let tree: Node<P>;

  const reRender = () => {
    rootCanvas.clearCanvas();
    drawTree(tree, rootCanvas);
  };
  tree = mountTree<P>(element, undefined, rootCanvas, reRender);
  reRender();

  root.appendChild(rootCanvasElement);

  return root;
}
