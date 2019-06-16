import Canvasimo from 'canvasimo';
import { Canvas, Component, createElement } from 'cba';
import * as mountUpdateTree from '../../src/internal/mount-update-tree';
import { createCanvas } from '../helpers/canvas';

const originalCreateElement = document.createElement;
jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
  const element = originalCreateElement.call(document, tag);

  if (tag === 'canvas') {
    jest
      .spyOn(element as HTMLCanvasElement, 'getContext')
      .mockImplementation((type: string) => {
        if (type !== '2d') {
          throw new Error('Invalid attempted to get context other than 2d');
        }

        return ({
          // Prevents unsupported warnings
          setLineDash: jest.fn(),
          getLineDash: jest.fn(),
        } as unknown) as CanvasRenderingContext2D;
      });
  }

  return element;
});

describe('mountTree', () => {
  it('should create a node from the provided element', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = mountUpdateTree.mountTree(
      element,
      undefined,
      rootCanvas,
      reRender
    );

    expect(typeof node).toEqual('object');
    expect(node.injected.canvas instanceof Canvasimo).toBe(true);
    expect(node.injected.canvas).not.toBe(rootCanvas);
  });

  it('should create a node from the provided element with the root canvas, if the element is a canvas element', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const element = createElement(Canvas, { width: 100, height: 100 });
    const node = mountUpdateTree.mountTree(
      element,
      undefined,
      rootCanvas,
      reRender
    );

    expect(typeof node).toEqual('object');
    expect(node.injected.canvas instanceof Canvasimo).toBe(true);
    expect(node.injected.canvas).toBe(rootCanvas);
  });

  it('should assign the onDestroy callback to the created node', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();

    const onDestroyCallback = jest.fn();
    const onCreationCallback = jest.fn().mockReturnValue(onDestroyCallback);

    const Foo: Component = (_, { onCreation }) => {
      onCreation(onCreationCallback);
      return undefined;
    };
    const element = createElement(Foo, {});
    const node = mountUpdateTree.mountTree(
      element,
      undefined,
      rootCanvas,
      reRender
    );

    expect(typeof node).toEqual('object');
    expect(node.onDestroy).toBe(onDestroyCallback);
  });
});
