import { createElement } from 'cba';
import { createNode } from '../../src/internal/create-node';
import { destroyTree } from '../../src/internal/destroy-tree';
import { createCanvas } from '../helpers/canvas';

describe('destroyTree', () => {
  it('should call onDestroy for every node in a tree (if it exists)', () => {
    const { canvas } = createCanvas();
    const SingleChild = () => undefined;
    const FirstChild = () => undefined;
    const SecondChild = () => createElement(SingleChild, {});
    const Foo = () => [
      createElement(FirstChild, {}),
      createElement(SecondChild, {}),
    ];
    const element = createElement(Foo, {});
    const node = createNode(element, undefined, canvas, jest.fn());

    node.onDestroy = jest.fn();

    node.rendered = Foo().map(child =>
      createNode(child, node, canvas, jest.fn())
    );

    node.rendered[1].rendered = createNode(
      SecondChild(),
      node.rendered[1],
      canvas,
      jest.fn()
    );
    node.rendered[1].rendered.onDestroy = jest.fn();

    destroyTree(node);

    expect(node.onDestroy).toHaveBeenCalledTimes(1);
    expect(node.rendered[1].rendered.onDestroy).toHaveBeenCalledTimes(1);
  });
});
