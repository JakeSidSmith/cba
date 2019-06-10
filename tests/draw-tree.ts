import { createElement } from 'cba';
import { createNode } from '../src/create-node';
import { drawTree } from '../src/draw-tree';
import { createCanvas } from './helpers/canvas';

describe('drawTree', () => {
  it('should draw a nodes canvas to the provided canvas', () => {
    const { canvasElement, canvas } = createCanvas();
    const { canvas: rootCanvas } = createCanvas();
    jest.spyOn(rootCanvas, 'drawImage').mockImplementation(jest.fn());

    const Foo = () => undefined;
    const element = createElement(Foo, {});
    const node = createNode(element, undefined, canvas, jest.fn());

    drawTree(node, rootCanvas);

    expect(rootCanvas.drawImage).toHaveBeenCalledWith(canvasElement, 0, 0);
  });
});
