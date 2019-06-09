import Canvasimo from 'canvasimo';
import { Node } from './types';
import { isNodeArray } from './utils';

export function drawTree<P = {}>(node: Node<P>, canvas: Canvasimo): void {
  const element = node.injected.canvas.getElement();
  canvas.drawImage(element, 0, 0);

  if (isNodeArray(node.rendered)) {
    node.rendered.forEach(child => drawTree(child, canvas));
  } else if (node.rendered) {
    drawTree(node.rendered, canvas);
  }
}
