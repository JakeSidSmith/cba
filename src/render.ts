import Canvasimo from 'canvasimo';
import { Canvas } from './canvas';
import { drawTree } from './draw-tree';
import { Element, Injected, Node } from './types';
import { isElementArray, isNodeArray } from './utils';

export function updateTree<P = {}, S = {}>(
  next: Element<P, S>,
  prev: Node<P, S>,
  rootCanvas: Canvasimo,
  reRender: () => void
): Node<P, S> {
  if (next.type === prev.type) {
    prev.injected.canvas
      .setSize(rootCanvas.getSize())
      .setDensity(rootCanvas.getDensity());

    const rendered = next.type(next.props, prev.injected);

    if (isElementArray(rendered)) {
      if (!isNodeArray(prev.rendered)) {
        prev.rendered = rendered.map((child, _index) => {
          // unmountRendered(
          //   (prev.rendered as ReadonlyArray<Node | undefined>)[index]
          // );

          return mountTree(child, rootCanvas, reRender);
        });
      } else {
        prev.rendered = rendered.map((child, index) => {
          const prevChild = (prev.rendered as ReadonlyArray<Node | undefined>)[
            index
          ];

          if (!prevChild) {
            return mountTree(child, rootCanvas, reRender);
          }

          return updateTree(child, prevChild, rootCanvas, reRender);
        });
      }
    } else if (rendered) {
      if (isNodeArray(prev.rendered) || !prev.rendered) {
        // unmountRendered(prev.rendered);

        prev.rendered = mountTree(rendered, rootCanvas, reRender);
      } else {
        prev.rendered = updateTree(
          rendered,
          prev.rendered,
          rootCanvas,
          reRender
        );
      }
    } else {
      // unmountRendered(prev.rendered);
      prev.rendered = undefined;
    }

    return prev;
  } else {
    // unmountRendered(prev);

    return mountTree(next, rootCanvas, reRender);
  }
}

function renderAndMount<P = {}, S = {}>(
  element: Element<P, S>,
  injected: Injected<S>,
  rootCanvas: Canvasimo,
  reRender: () => void
): Node | ReadonlyArray<Node> | undefined {
  const renderResult = element.type(element.props, injected);

  if (isElementArray(renderResult)) {
    return renderResult.map(child => {
      return mountTree(child, rootCanvas, reRender);
    });
  }

  if (renderResult) {
    return mountTree(renderResult, rootCanvas, reRender);
  }

  return undefined;
}

function mountTree<P = {}, S = {}>(
  element: Element<P, S>,
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
    type: element.type,
    previousProps: { ...element.props },
    rendered: undefined,
    injected: {
      canvas,
      setState: (state: Partial<S>) => {
        element.props = { ...node.previousProps, ...state };

        updateTree(element, node, rootCanvas, reRender);
        reRender();
      },
    },
  };

  node.rendered = renderAndMount(element, node.injected, rootCanvas, reRender);

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
  tree = mountTree<P>(element, rootCanvas, reRender);
  reRender();

  root.appendChild(rootCanvasElement);

  return root;
}
