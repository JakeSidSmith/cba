/* @jsx cba.createElement */

import cba, { Canvas, Component, render } from 'cba';

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface DynamicRectState {
  scale: number;
}

const Rect: Component<RectProps> = (
  { x, y, width, height, fill, children },
  { canvas }
) => {
  canvas.fillRect(x, y, width, height, fill);
  return children;
};

const DynamicRect: Component<RectProps, DynamicRectState> = (
  { x, y, width, height, fill, children, scale = 1 },
  { setState }
) => {
  if (scale === 1) {
    setTimeout(() => {
      setState({ scale: 0.5 });
    }, 1000);
  }

  return (
    <Rect x={x} y={y} width={width * scale} height={height * scale} fill={fill}>
      {children}
    </Rect>
  );
};

const App: Component = () => (
  <Canvas width={300} height={300} density={2}>
    <Rect x={10} y={10} width={280} height={280} fill="black">
      <Rect x={20} y={20} width={260} height={260} fill="red" />
    </Rect>
    <DynamicRect x={50} y={50} width={200} height={200} fill="cyan" />
  </Canvas>
);

render(<App />, document.getElementById('app') as HTMLElement);
