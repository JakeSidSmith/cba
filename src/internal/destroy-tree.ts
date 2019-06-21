import { Node } from '../types';
import { isNodeArray } from './utils';

export function destroyTree<GivenProps = {}, OwnProps = {}>(
  node: Node<GivenProps, OwnProps> | ReadonlyArray<Node> | undefined
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
