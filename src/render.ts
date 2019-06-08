import Canvasimo from 'canvasimo';
import { Canvas } from './canvas';
import { drawTree } from './draw-tree';
import { Element, Node } from './types';

const isElementArray = <P = {}>(
  element: Element<P> | ReadonlyArray<Element> | undefined
): element is ReadonlyArray<Element> => Array.isArray(element);

function renderAndMount<P = {}>(
  element: Element<P>,
  canvas: Canvasimo,
  rootCanvasElement: HTMLCanvasElement,
  rootCanvas: Canvasimo,
  reRender: () => void
): Node | ReadonlyArray<Node> | undefined {
  const renderResult = element.type(element.props, { canvas });

  if (isElementArray(renderResult)) {
    return renderResult.map(child => {
      return mountTree(child, rootCanvasElement, rootCanvas, reRender);
    });
  }

  if (renderResult) {
    return mountTree(renderResult, rootCanvasElement, rootCanvas, reRender);
  }

  return undefined;
}

function mountTree<P = {}>(
  element: Element<P>,
  rootCanvasElement: HTMLCanvasElement,
  rootCanvas: Canvasimo,
  reRender: () => void
): Node<P> {
  let canvasElement: HTMLCanvasElement | undefined;
  let canvas: Canvasimo | undefined;

  // @ts-ignore
  if (element.type === Canvas) {
    canvasElement = rootCanvasElement;
    canvas = rootCanvas;
  } else {
    canvasElement = document.createElement('canvas');
    canvas = new Canvasimo(canvasElement)
      .setSize(rootCanvas.getSize())
      .setDensity(rootCanvas.getDensity());
  }

  const rendered = renderAndMount(
    element,
    canvas,
    rootCanvasElement,
    rootCanvas,
    reRender
  );

  const node: Node<P> = {
    type: element.type,
    canvasElement,
    canvas,
    previousProps: { ...element.props },
    rendered,
  };

  return node;
}

export function render<P = {}>(element: Element<P>, root: HTMLElement) {
  const canvasElement = document.createElement('canvas');
  const canvas = new Canvasimo(canvasElement);

  let tree: Node<P>;

  const reRender = () => {
    canvas.clearCanvas();
    drawTree(tree, canvas);
  };
  tree = mountTree<P>(element, canvasElement, canvas, reRender);
  reRender();

  root.appendChild(canvasElement);

  return root;
}
