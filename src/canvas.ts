import { Component } from './types';

export interface CanvasProps {
  width: number;
  height: number;
  density?: number;
}

const Canvas: Component<CanvasProps> = (
  { width, height, density, children },
  { canvas }
) => {
  canvas.setDensity(density || 1).setSize(width, height);
  return children;
};

export { Canvas };
