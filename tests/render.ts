import Canvasimo from 'canvasimo';
import { createElement, render } from 'cba';
import * as drawTreeModule from '../src/internal/draw-tree';
import * as treeUtilsModule from '../src/internal/tree-utils';

const mountTreeSpy = jest.fn();
const renderAndMountTreeSpy = jest.fn();
const updateTreeSpy = jest.fn();

const createTreeUtilsSpy = jest
  .spyOn(treeUtilsModule, 'createTreeUtils')
  .mockReturnValue({
    mountTree: mountTreeSpy,
    renderAndMountTree: renderAndMountTreeSpy,
    updateTree: updateTreeSpy,
  });
const drawTreeSpy = jest
  .spyOn(drawTreeModule, 'drawTree')
  .mockImplementation(jest.fn());

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

let requestAnimationFrameCallCount = -1;

const requestAnimationFrameSpy = jest
  .spyOn(window, 'requestAnimationFrame')
  .mockImplementation(() => (requestAnimationFrameCallCount += 1));
const cancelAnimationFrameSpy = jest
  .spyOn(window, 'cancelAnimationFrame')
  .mockImplementation(jest.fn());

beforeEach(() => {
  createTreeUtilsSpy.mockClear();
  mountTreeSpy.mockClear();
  updateTreeSpy.mockClear();
  drawTreeSpy.mockClear();
  requestAnimationFrameSpy.mockClear();
  cancelAnimationFrameSpy.mockClear();
});

describe('render', () => {
  it('should create tree utils with the root canvas, and a reRender function; call mountTree with the provided element, an undefined parent node; and return the provided root element', () => {
    const Foo = () => undefined;
    const root = document.createElement('div');
    const element = createElement(Foo, {});

    const result = render(element, root);

    expect(createTreeUtilsSpy).toHaveBeenCalledTimes(1);

    const [createTreeUtilsCall] = createTreeUtilsSpy.mock.calls;

    expect(createTreeUtilsCall[0] instanceof Canvasimo).toBe(true);
    expect(typeof createTreeUtilsCall[1]).toBe('function');

    expect(mountTreeSpy).toHaveBeenCalledTimes(1);

    const [mountTreeCall] = mountTreeSpy.mock.calls;

    expect(mountTreeCall[0]).toBe(element);
    expect(mountTreeCall[1]).toBe(undefined);

    expect(result).toBe(root);
  });
});

describe('reRender', () => {
  const Foo = () => undefined;
  const root = document.createElement('div');
  const element = createElement(Foo, {});

  render(element, root);

  const [createTreeUtilsCall] = createTreeUtilsSpy.mock.calls;
  const [, reRender] = createTreeUtilsCall;

  const before = jest.fn();
  const after = jest.fn();

  it('should queue a re-render using requestAnimationFrame, call the provided before / after functions, update and redraw the tree', () => {
    reRender(before, after);
    reRender();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(2);

    const [
      latestRequestAnimationFrameCall,
    ] = requestAnimationFrameSpy.mock.calls;

    expect(typeof latestRequestAnimationFrameCall[0]).toBe('function');

    latestRequestAnimationFrameCall[0](0);

    expect(before).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(1);

    expect(updateTreeSpy).toHaveBeenCalledTimes(1);
    expect(drawTreeSpy).toHaveBeenCalledTimes(1);
  });
});
