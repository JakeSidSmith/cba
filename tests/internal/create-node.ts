import { Component, createElement } from 'cba';
import { createNode } from '../../src/internal/create-node';
import { createCanvas } from '../helpers/canvas';

describe('createNode', () => {
  const { canvas } = createCanvas();

  it('creates a node from an element', () => {
    const Foo: Component = () => undefined;
    const element = createElement(Foo, { foo: 'bar' });
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

  it('inherits its parents childTransforms', () => {
    const Foo: Component = () => undefined;
    const parentElement = createElement(Foo, { foo: 'bar' });
    const parentNode = createNode(parentElement, undefined, canvas, jest.fn());
    parentNode.childTransforms = [() => null];

    const element = createElement(Foo, { foo: 'bar' });
    const node = createNode(element, parentNode, canvas, jest.fn());

    expect(node.childTransforms).toEqual(parentNode.childTransforms);
  });

  describe('setState', () => {
    it('should update the nodes state with the provided object', () => {
      const Foo: Component = () => undefined;
      const reRender = jest.fn();
      const element = createElement(Foo, { foo: '123' });
      const node = createNode(element, undefined, canvas, reRender);
      const newState = {
        bar: '456',
      };

      node.injected.setState(newState);

      expect(reRender).toHaveBeenCalledTimes(1);

      const [beforeRender, afterRender] = reRender.mock.calls[0];

      expect(node.previousProps).toBe(element.props);
      expect(node.state).toEqual({});

      beforeRender();

      expect(node.previousProps).toBe(element.props);
      expect(node.state).toBe(newState);

      afterRender();

      expect(node.previousProps).toEqual({ ...element.props, ...newState });
      expect(node.state).toBe(newState);
    });
  });

  it('should update the nodes state by calling the provided function with existing state', () => {
    const Foo: Component<{ foo: string }, { count: number }> = () => undefined;
    const reRender = jest.fn();
    const element = createElement(Foo, { foo: '123' });
    const node = createNode(element, undefined, canvas, reRender);
    node.state = {
      count: 0,
    };

    node.injected.setState(({ count = 7 }) => ({
      count: count + 1,
    }));

    expect(reRender).toHaveBeenCalledTimes(1);

    const [beforeRender, afterRender] = reRender.mock.calls[0];

    expect(node.previousProps).toBe(element.props);
    expect(node.state).toEqual({ count: 0 });

    beforeRender();

    expect(node.previousProps).toBe(element.props);
    expect(node.state).toEqual({ count: 1 });

    afterRender();

    expect(node.previousProps).toEqual({ ...element.props, count: 1 });
    expect(node.state).toEqual({ count: 1 });
  });

  describe('onCreation', () => {
    it('sets the nodes onCreation property if not already set', () => {
      const Foo: Component = () => undefined;
      const element = createElement(Foo, { foo: 'bar' });
      const node = createNode(element, undefined, canvas, jest.fn());

      const firstOnCreation = jest.fn();
      const secondOnCreation = jest.fn();

      expect(node.onCreation).toBe(undefined);
      node.injected.onCreation(firstOnCreation);
      expect(node.onCreation).toBe(firstOnCreation);
      node.injected.onCreation(secondOnCreation);
      expect(node.onCreation).toBe(firstOnCreation);
    });
  });

  // describe('onUpdate', () => {});

  // describe('addChildTransform', () => {});
});
