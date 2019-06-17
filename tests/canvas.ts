import { Canvas, CanvasProps, Element } from 'cba';
import { createInjected } from './helpers/injected';

describe('Canvas', () => {
  const injected = createInjected<CanvasProps>();

  const setDensitySpy = jest
    .spyOn(injected.canvas, 'setDensity')
    .mockReturnValue(injected.canvas);
  const setSizeSpy = jest
    .spyOn(injected.canvas, 'setSize')
    .mockReturnValue(injected.canvas);

  afterEach(() => {
    setDensitySpy.mockClear();
    setSizeSpy.mockClear();
  });

  it('should set the canvas density to the provided value', () => {
    Canvas({ width: 123, height: 456, density: 4 }, injected);
    expect(injected.canvas.setDensity).toHaveBeenCalledWith(4);
  });

  it('should set the canvas size to the provided width and height', () => {
    Canvas({ width: 123, height: 456, density: 4 }, injected);
    expect(injected.canvas.setSize).toHaveBeenCalledWith(123, 456);
  });

  it('should return the provided children', () => {
    const children: Element[] = [];
    const returned = Canvas(
      { width: 123, height: 456, density: 4, children },
      injected
    );
    expect(returned).toBe(children);
  });

  it('should set the density to 1 when the provided density is falsy', () => {
    Canvas({ width: 123, height: 456, density: 0 }, injected);
    expect(injected.canvas.setDensity).toHaveBeenCalledWith(1);
  });
});
