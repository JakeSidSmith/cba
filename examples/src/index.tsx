/* @jsx cba.createElement */

import cba, { Canvas, Component, render } from 'cba';
import { DynamicRect } from './components/dynamic-rect';
import { FPS } from './components/fps';
import { PointerCircle } from './components/pointer-circle';
import { Rect } from './components/rect';
import { Time } from './components/time';
import { timeStore } from './time-store';

const DENSITY = window.devicePixelRatio >= 2 ? 2 : 1;

const App: Component = (_, { onCreation }) => {
  onCreation(() => {
    setInterval(() => {
      timeStore.setStoreState({
        time: new Date().toString(),
      });
    }, 500);
  });

  return (
    <Canvas width={300} height={300} density={DENSITY}>
      <Rect x={10} y={10} width={280} height={280} fill="black">
        <Rect x={20} y={20} width={260} height={260} fill="red" />
      </Rect>
      <DynamicRect x={50} y={50} width={200} height={200} fill="cyan" />
      <PointerCircle />
      <Time />
      <FPS />
    </Canvas>
  );
};

render(<App />, document.getElementById('app') as HTMLElement);
