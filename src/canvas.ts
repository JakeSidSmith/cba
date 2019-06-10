import { CanvasProps, Component, Element } from './types';

const Canvas: Component<CanvasProps, {}, Element> = (
  { width, height, density, children },
  { canvas }
) => {
  canvas.setDensity(density || 1).setSize(width, height);
  return children;
};

export { Canvas };
