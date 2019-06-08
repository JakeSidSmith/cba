import Canvasimo from 'canvasimo';
import { Node } from './types';

const isNodeArray = <P = {}>(
  node: Node<P> | ReadonlyArray<Node> | undefined
): node is ReadonlyArray<Node> => Array.isArray(node);

export function drawTree<P = {}>(node: Node<P>, canvas: Canvasimo): void {
  if (node.canvasElement) {
    canvas.drawImage(node.canvasElement, 0, 0);
  }

  if (isNodeArray(node.rendered)) {
    node.rendered.forEach(child => drawTree(child, canvas));
  } else if (node.rendered) {
    drawTree(node.rendered, canvas);
  }
}
