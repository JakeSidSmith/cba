import { createElement } from 'cba';
import { createNode } from '../../src/internal/create-node';
import { createCanvas } from '../helpers/canvas';

describe('createNode', () => {
  const Foo = () => undefined;
  const element = createElement(Foo, { foo: 'bar' });
  const { canvas } = createCanvas();

  it('creates a node from an element', () => {
    const node = createNode(element, undefined, canvas, jest.fn());

    expect(node.element).toBe(element);
    expect(node.previousProps).toBe(element.props);
    expect(node.rendered).toBe(undefined);
    expect(node.onCreation).toBe(undefined);
    expect(node.onDestroy).toBe(undefined);
    expect(node.onUpdate).toBe(undefined);
    expect(node.state).toEqual({});
    expect(node.childTransforms).toEqual([]);
    expect(node.injected.canvas).toBe(canvas);
    expect(typeof node.injected.setState).toBe('function');
    expect(typeof node.injected.onCreation).toBe('function');
    expect(typeof node.injected.onUpdate).toBe('function');
    expect(typeof node.injected.addChildTransform).toBe('function');
  });
});
