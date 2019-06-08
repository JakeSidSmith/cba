/* @jsx cba.createElement */

import cba, { Canvas, Component, render } from 'cba';

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const Rect: Component<RectProps> = (
  { x, y, width, height, fill, children },
  { canvas }
) => {
  canvas.fillRect(x, y, width, height, fill);
  return children;
};

const App: Component = () => (
  <Canvas width={300} height={300} density={2}>
    <Rect x={10} y={10} width={280} height={280} fill="black">
      <Rect x={20} y={20} width={260} height={260} fill="red" />
    </Rect>
  </Canvas>
);

render(<App />, document.getElementById('app') as HTMLElement);
