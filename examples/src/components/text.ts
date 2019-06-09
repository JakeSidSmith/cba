import { Component } from 'cba';

export interface TextProps {
  text: string;
  x: number;
  y: number;
  fill: string;
  maxWidth?: number;
  children?: never;
}

const Text: Component<TextProps> = (
  { text, x, y, fill, maxWidth },
  { canvas }
) => {
  canvas.fillText(text, x, y, maxWidth, fill);
  return undefined;
};

export { Text };
