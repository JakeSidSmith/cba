/* @jsx cba.createElement */

import cba, { Canvas, Component } from 'cba';
import { Rect } from '../common/components/rect';

const DENSITY = window.devicePixelRatio >= 2 ? 2 : 1;

const Example2: Component = () => {
  return (
    <Canvas width={300} height={300} density={DENSITY}>
      <Rect x={100} y={100} width={100} height={100} fill="black" />
    </Canvas>
  );
};

export { Example2 };
