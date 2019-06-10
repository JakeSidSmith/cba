import { ComponentNoChildren } from 'cba';

export interface TextProps {
  x: number;
  y: number;
  fill: string;
  maxWidth?: number;
  children?: [string];
}

const Text: ComponentNoChildren<TextProps> = (
  { x, y, fill, maxWidth, children },
  { canvas }
) => {
  if (children && children.length) {
    canvas.fillText(children[0], x, y, maxWidth, fill);
  }

  return undefined;
};

export { Text };
