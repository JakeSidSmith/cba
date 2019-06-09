/* @jsx cba.createElement */

import cba, { Canvas, Component, render } from 'cba';

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fill: string;
}

interface DynamicRectState {
  rotation: number;
}

const Rect: Component<RectProps> = (
  { x, y, width, height, fill, rotation = 0, children },
  { canvas }
) => {
  const size = canvas.getSize();

  canvas
    .translate(size.width / 2, size.height / 2)
    .rotate(rotation)
    .fillRect(x - size.width / 2, y - size.height / 2, width, height, fill);

  return children;
};

const DynamicRect: Component<RectProps, DynamicRectState> = (
  { x, y, width, height, fill, children, rotation = 0 },
  { canvas, setState }
) => {
  window.requestAnimationFrame(() => {
    setState({ rotation: rotation + canvas.getRadiansFromDegrees(1) });
  });

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rotation={rotation}
    >
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
