import { Component } from 'cba';

export interface TextProps {
  x: number;
  y: number;
  fill: string;
  maxWidth?: number;
  children?: ReadonlyArray<string | undefined>;
}

const Text: Component<TextProps> = (
  { x, y, fill, maxWidth, children: [child] = [] },
  { canvas }
) => {
  if (typeof child === 'string') {
    canvas.fillText(child, x, y, maxWidth, fill);
  }

  return undefined;
};

export { Text };
