import Canvasimo from 'canvasimo';
import { drawTree } from './internal/draw-tree';
import { createTreeUtils } from './internal/tree-utils';
import { TreeUtils } from './internal/types';
import { Element, Node } from './types';

export function render<P = {}>(element: Element<P>, root: HTMLElement) {
  const rootCanvasElement = document.createElement('canvas');
  const rootCanvas = new Canvasimo(rootCanvasElement);

  const queuedBeforeRender: Array<() => void> = [];
  const queuedAfterRender: Array<() => void> = [];

  let queuedRender: number | undefined;
  let tree: Node<P>;
  let treeUtils: TreeUtils;

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
        /* istanbul ignore else */
        if (queuedUpdate) {
          queuedUpdate();
        }
      }

      treeUtils.updateTree(element, tree, undefined);

      rootCanvas.clearCanvas();
      drawTree(tree, rootCanvas);

      while (queuedAfterRender.length) {
        const queuedUpdate = queuedAfterRender.shift();
        /* istanbul ignore else */
        if (queuedUpdate) {
          queuedUpdate();
        }
      }
    });
  };

  treeUtils = createTreeUtils(rootCanvas, reRender);
  tree = treeUtils.mountTree<P>(element, undefined);
  reRender();

  root.appendChild(rootCanvasElement);

  return root;
}
