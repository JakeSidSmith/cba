import Canvasimo from 'canvasimo';
import { Component } from 'cba';

export interface TranslateAroundProps {
  x: number;
  y: number;
  rotation: number;
}

const TranslateAround: Component<TranslateAroundProps> = (
  { x, y, rotation, children },
  { addChildTransform }
) => {
  addChildTransform((canvas: Canvasimo) => {
    canvas
      .translate(x, y)
      .rotate(rotation)
      .translate(-x, -y);
  });

  return children;
};

export { TranslateAround };
