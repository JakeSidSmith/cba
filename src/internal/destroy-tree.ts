import { Node } from '../types';
import { isNodeArray } from './utils';

export function destroyTree<P = {}, S = {}>(
  node: Node<P, S> | ReadonlyArray<Node> | undefined
): void {
  if (!node) {
    return;
  }

  if (isNodeArray(node)) {
    node.forEach(destroyTree);
  } else {
    destroyTree(node.rendered);

    if (node.onDestroy) {
      node.onDestroy();
    }
  }
}
