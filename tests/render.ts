import Canvasimo from 'canvasimo';
import { createElement, render } from 'cba';
import * as drawTreeModule from '../src/internal/draw-tree';
import * as mountUpdateTree from '../src/internal/mount-update-tree';

const mountTreeSpy = jest
  .spyOn(mountUpdateTree, 'mountTree')
  .mockImplementation(jest.fn());
const updateTreeSpy = jest
  .spyOn(mountUpdateTree, 'updateTree')
  .mockImplementation(jest.fn());
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
  mountTreeSpy.mockClear();
  updateTreeSpy.mockClear();
  drawTreeSpy.mockClear();
  requestAnimationFrameSpy.mockClear();
  cancelAnimationFrameSpy.mockClear();
});

describe('render', () => {
  it('should call mountTree with the provided element, an undefined parent node, the root canvas, and a reRender function, and return the provided root element', () => {
    const Foo = () => undefined;
    const root = document.createElement('div');
    const element = createElement(Foo, {});

    const result = render(element, root);

    expect(mountTreeSpy).toHaveBeenCalledTimes(1);

    const [mountTreeCall] = mountTreeSpy.mock.calls;

    expect(mountTreeCall[0]).toBe(element);
    expect(mountTreeCall[1]).toBe(undefined);
    expect(mountTreeCall[2] instanceof Canvasimo).toBe(true);
    expect(typeof mountTreeCall[3]).toBe('function');

    expect(result).toBe(root);
  });
});

describe('reRender', () => {
  const Foo = () => undefined;
  const root = document.createElement('div');
  const element = createElement(Foo, {});

  render(element, root);

  const [mountTreeCall] = mountTreeSpy.mock.calls;
  const [, , , reRender] = mountTreeCall;

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
