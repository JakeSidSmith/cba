import Canvasimo from 'canvasimo';
import { drawTree } from './internal/draw-tree';
import { mountTree, updateTree } from './internal/mount-update-tree';
import { Element, Node } from './types';

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
