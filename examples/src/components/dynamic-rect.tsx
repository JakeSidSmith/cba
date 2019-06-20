/* @jsx cba.createElement */

import cba, { Component } from 'cba';
import { Rect, RectProps } from './rect';
import { TranslateAround } from './translate-around';

interface DynamicRectState {
  rotation: number;
}

const DynamicRect: Component<RectProps, DynamicRectState> = (
  { x, y, width, height, fill, children, rotation = 0 },
  { canvas, setOwnState, onCreate, onUpdate }
) => {
  const onChange = () => {
    setOwnState(state => ({
      rotation: (state.rotation || 0) + canvas.getRadiansFromDegrees(1),
    }));
  };

  onCreate(onChange);
  onUpdate(onChange);

  const size = canvas.getSize();

  return (
    <TranslateAround x={size.width / 2} y={size.height / 2} rotation={rotation}>
      <Rect x={x} y={y} width={width} height={height} fill={fill}>
        {children}
      </Rect>
    </TranslateAround>
  );
};

export { DynamicRect };
