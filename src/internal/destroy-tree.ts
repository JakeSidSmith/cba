import { Node } from '../types';
import { isNodeArray } from './utils';

export function destroyTree<P = {}, S = {}>(
  rendered: Node<P, S> | ReadonlyArray<Node> | undefined
): void {
  if (!rendered) {
    return;
  }

  if (isNodeArray(rendered)) {
    rendered.forEach(destroyTree);
  } else if (rendered.onDestroy) {
    rendered.onDestroy();
  }
}
