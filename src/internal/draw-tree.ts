import Canvasimo from 'canvasimo';
import { Node } from '../types';
import { isNodeArray } from './utils';

export function drawTree<P = {}>(node: Node<P>, rootCanvas: Canvasimo): void {
  const element = node.injected.canvas.getElement();
  rootCanvas.drawImage(element, 0, 0);

  if (isNodeArray(node.rendered)) {
    node.rendered.forEach(child => drawTree(child, rootCanvas));
  } else if (node.rendered) {
    drawTree(node.rendered, rootCanvas);
  }
}
