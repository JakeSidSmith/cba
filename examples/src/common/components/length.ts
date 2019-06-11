import { Component } from 'cba';

export interface LengthProps {
  x: number;
  y: number;
  length: number;
  angle: number;
  color: string;
  strokeWidth?: number;
}

const Length: Component<LengthProps> = (
  { x, y, length, angle, color, strokeWidth = 1 },
  { canvas }
) => {
  canvas.setStrokeWidth(strokeWidth).strokeLength(x, y, length, angle, color);

  return undefined;
};

export { Length };
