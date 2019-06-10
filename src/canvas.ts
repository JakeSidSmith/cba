import { CanvasProps, Component } from './types';

const Canvas: Component<CanvasProps> = (
  { width, height, density, children },
  { canvas }
) => {
  canvas.setDensity(density || 1).setSize(width, height);
  return children;
};

export { Canvas };
