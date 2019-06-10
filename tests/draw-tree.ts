import { createElement } from 'cba';
import { createNode } from '../src/create-node';
import { drawTree } from '../src/draw-tree';
import { createCanvas } from './helpers/canvas';

describe('drawTree', () => {
  const { canvas: rootCanvas } = createCanvas();
  const rootDrawImageSpy = jest
    .spyOn(rootCanvas, 'drawImage')
    .mockImplementation(jest.fn());

  afterEach(() => {
    rootDrawImageSpy.mockClear();
  });

  it('should draw a nodes canvas to the provided canvas', () => {
    const { canvasElement, canvas } = createCanvas();

    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = createNode(element, undefined, canvas, jest.fn());

    drawTree(node, rootCanvas);

    expect(rootCanvas.drawImage).toHaveBeenCalledTimes(1);
    expect(rootCanvas.drawImage).toHaveBeenCalledWith(canvasElement, 0, 0);
  });

  it('should draw each child to the provided canvas', () => {
    const { canvas } = createCanvas();
    const {
      canvasElement: firstChildCanvasElement,
      canvas: firstChildCanvas,
    } = createCanvas();
    const {
      canvasElement: secondChildCanvasElement,
      canvas: secondChildCanvas,
    } = createCanvas();

    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = createNode(element, undefined, canvas, jest.fn());

    node.rendered = [
      createNode(element, undefined, firstChildCanvas, jest.fn()),
      createNode(element, undefined, secondChildCanvas, jest.fn()),
    ];

    drawTree(node, rootCanvas);

    expect(rootCanvas.drawImage).toHaveBeenCalledTimes(3);
    expect(rootCanvas.drawImage).toHaveBeenCalledWith(
      firstChildCanvasElement,
      0,
      0
    );
    expect(rootCanvas.drawImage).toHaveBeenCalledWith(
      secondChildCanvasElement,
      0,
      0
    );
  });

  it('should draw a single child to the provided canvas', () => {
    const { canvas } = createCanvas();
    const {
      canvasElement: childCanvasElement,
      canvas: childCanvas,
    } = createCanvas();

    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = createNode(element, undefined, canvas, jest.fn());

    node.rendered = createNode(element, undefined, childCanvas, jest.fn());

    drawTree(node, rootCanvas);

    expect(rootCanvas.drawImage).toHaveBeenCalledTimes(2);
    expect(rootCanvas.drawImage).toHaveBeenCalledWith(childCanvasElement, 0, 0);
  });
});
