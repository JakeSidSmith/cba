import { Component, Element } from 'cba';

export interface CircleProps {
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const TRANSPARENT = 'transparent';

const Circle: Component<CircleProps, {}, Element> = (
  {
    x,
    y,
    radius,
    fill = TRANSPARENT,
    stroke = TRANSPARENT,
    strokeWidth = 1,
    children,
  },
  { canvas }
) => {
  if (!fill && !stroke) {
    return children;
  }

  canvas
    .plotCircle(x, y, radius, false)
    .fill(fill)
    .setStrokeWidth(strokeWidth)
    .stroke(stroke);

  return children;
};

export { Circle };
