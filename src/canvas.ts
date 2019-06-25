import { CANVAS_TYPE } from './internal/constants';
import { CanvasComponent, CanvasProps } from './types';

const Canvas: CanvasComponent<CanvasProps> = (
  { width, height, density, children },
  { canvas }
) => {
  canvas.setDensity(density || 1).setSize(width, height);
  return children;
};

Canvas._type = CANVAS_TYPE;

export { Canvas };
