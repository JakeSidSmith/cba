import Canvasimo from 'canvasimo';
import { Canvas, Component, createElement, Node } from 'cba';
import { createNode } from '../../src/internal/create-node';
import { createTreeUtils } from '../../src/internal/tree-utils';
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
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = treeUtils.mountTree(element, undefined);

    expect(typeof node).toEqual('object');
    expect(node.injected.canvas instanceof Canvasimo).toBe(true);
    expect(node.injected.canvas).not.toBe(rootCanvas);
  });

  it('should create a node from the provided element with the root canvas, if the element is a canvas element', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const element = createElement(Canvas, { width: 100, height: 100 });
    const node = treeUtils.mountTree(element, undefined);

    expect(typeof node).toEqual('object');
    expect(node.injected.canvas instanceof Canvasimo).toBe(true);
    expect(node.injected.canvas).toBe(rootCanvas);
  });

  it('should assign the onDestroy callback to the created node', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const onDestroyCallback = jest.fn();
    const onCreationCallback = jest.fn().mockReturnValue(onDestroyCallback);

    const Foo: Component = (_, { onCreation }) => {
      onCreation(onCreationCallback);
      return undefined;
    };
    const element = createElement(Foo, {});
    const node = treeUtils.mountTree(element, undefined);

    expect(typeof node).toEqual('object');
    expect(node.onDestroy).toBe(onDestroyCallback);
  });
});

describe('renderAndMountTree', () => {
  it('should render an element and recursively mount each of its children', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const D = () => undefined;
    const C = () => createElement(D, {});
    const B = () => [createElement(C, {}), createElement(C, {})];
    const A = () => createElement(B, {});

    const element = createElement(A, {});
    const node = createNode(element, undefined, rootCanvas, reRender);
    const tree = treeUtils.renderAndMountTree(element, node, undefined);

    expect(typeof tree).toBe('object');
    expect(Array.isArray(tree)).toBe(false);
    expect(typeof (tree as Node).rendered).toBe('object');
    expect(Array.isArray((tree as Node).rendered)).toBe(true);
    expect(((tree as Node).rendered as ReadonlyArray<Node>).length).toBe(2);
    expect(
      typeof ((tree as Node).rendered as ReadonlyArray<Node>)[0].rendered
    ).toBe('object');
    expect(
      typeof ((tree as Node).rendered as ReadonlyArray<Node>)[1].rendered
    ).toBe('object');
    expect(
      Array.isArray(
        ((tree as Node).rendered as ReadonlyArray<Node>)[0].rendered
      )
    ).toBe(false);
    expect(
      Array.isArray(
        ((tree as Node).rendered as ReadonlyArray<Node>)[1].rendered
      )
    ).toBe(false);
    expect(
      typeof (((tree as Node).rendered as ReadonlyArray<Node>)[0]
        .rendered as Node).rendered
    ).toBe('undefined');
    expect(
      typeof (((tree as Node).rendered as ReadonlyArray<Node>)[1]
        .rendered as Node).rendered
    ).toBe('undefined');
  });

  it('should call a parents childTransform for each of its children', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const D = () => undefined;
    const C = () => createElement(D, {});
    const B = () => [createElement(C, {}), createElement(C, {})];
    const A = () => createElement(B, {});
    const childTransform = jest.fn();

    const element = createElement(A, {});
    const parentNode = createNode(
      createElement(() => undefined, {}),
      undefined,
      rootCanvas,
      reRender
    );
    parentNode.childTransforms = [childTransform];
    const node = createNode(element, parentNode, rootCanvas, reRender);

    treeUtils.renderAndMountTree(element, node, parentNode);

    // 1 x A, 1 x B, 2 x C, 2 x D
    expect(childTransform).toHaveBeenCalledTimes(6);
  });
});

describe('updateTree', () => {
  it('should destroy the tree, and mount a new tree when the element type changes', () => {
    const reRender = jest.fn();
    const { canvas: rootCanvas } = createCanvas();
    const treeUtils = createTreeUtils(rootCanvas, reRender);

    const mountTreeSpy = jest.spyOn(treeUtils, 'mountTree');

    const Next = () => undefined;
    const Prev = () => undefined;

    const nextElement = createElement(Prev, {});
    const prevNode = createNode(
      createElement(Next, {}),
      undefined,
      rootCanvas,
      reRender
    );

    treeUtils.updateTree(nextElement, prevNode, undefined);

    expect(mountTreeSpy).toHaveBeenCalledTimes(1);
    expect(mountTreeSpy).toHaveBeenLastCalledWith(nextElement, undefined);
  });
});
