import { Component } from './types';

export interface Props {
  width: number;
  height: number;
  density?: number;
}

const Canvas: Component<Props> = (
  { width, height, density, children },
  { canvas }
) => {
  canvas.setDensity(density || 1).setSize(width, height);
  return children;
};

export { Canvas };
