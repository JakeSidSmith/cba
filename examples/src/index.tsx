/* @jsx cba.createElement */

import Canvasimo from 'canvasimo';
import cba, { Canvas, Component, render } from 'cba';

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface DynamicRectState {
  rotation: number;
}

interface TranslateProps {
  x: number;
  y: number;
}

interface PointerCircleState {
  x: number;
  y: number;
}

interface RotateProps {
  rotation: number;
}

const Rect: Component<RectProps> = (
  { x, y, width, height, fill, children },
  { canvas }
) => {
  canvas.fillRect(x, y, width, height, fill);

  return children;
};

const Translate: Component<TranslateProps> = (
  { x, y, children },
  { addChildTransform }
) => {
  addChildTransform((canvas: Canvasimo) => {
    canvas.translate(x, y);
  });

  return children;
};

const Rotate: Component<RotateProps> = (
  { rotation, children },
  { addChildTransform }
) => {
  addChildTransform((canvas: Canvasimo) => {
    canvas.rotate(rotation);
  });

  return children;
};

const DynamicRect: Component<RectProps, DynamicRectState> = (
  { x, y, width, height, fill, children, rotation = 0 },
  { canvas, setState, onCreation, onUpdate }
) => {
  const onChange = () => {
    setState(state => ({
      rotation: (state.rotation || 0) + canvas.getRadiansFromDegrees(1),
    }));
  };

  onCreation(onChange);
  onUpdate(onChange);

  const size = canvas.getSize();

  return (
    <Translate x={size.width / 2} y={size.height / 2}>
      <Rotate rotation={rotation}>
        <Rect
          x={x - size.width / 2}
          y={y - size.height / 2}
          width={width}
          height={height}
          fill={fill}
        >
          {children}
        </Rect>
      </Rotate>
    </Translate>
  );
};

const PointerCircle: Component<{}, PointerCircleState> = (
  { children, x, y },
  { canvas, onCreation, setState }
) => {
  onCreation(() => {
    const rect = (document.getElementById(
      'app'
    ) as HTMLElement).getBoundingClientRect();

    const onMouseMove = (event: MouseEvent) => {
      setState({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  });

  if (typeof x === 'number' && typeof y === 'number') {
    canvas.fillCircle(x, y, 10, false, 'green');
  }

  return children;
};

const App: Component = () => (
  <Canvas width={300} height={300} density={2}>
    <Rect x={10} y={10} width={280} height={280} fill="black">
      <Rect x={20} y={20} width={260} height={260} fill="red" />
    </Rect>
    <DynamicRect x={50} y={50} width={200} height={200} fill="cyan" />
    <PointerCircle />
  </Canvas>
);

render(<App />, document.getElementById('app') as HTMLElement);
