import { Component, Element } from 'cba';

export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  children?: Element;
}

const Rect: Component<RectProps, {}> = (
  { x, y, width, height, fill, children },
  { canvas }
) => {
  canvas.fillRect(x, y, width, height, fill);

  return children;
};

export { Rect };
