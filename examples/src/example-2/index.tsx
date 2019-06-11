/* @jsx cba.createElement */

import cba, { Canvas, Component } from 'cba';
import { Circle } from '../common/components/circle';
import { Length } from '../common/components/length';

const DENSITY = window.devicePixelRatio >= 2 ? 2 : 1;
const PADDING = 20;

interface State {
  date: Date;
}

const Example2: Component<{}, State> = (
  { date = new Date() },
  { canvas, setState, onCreation, onUpdate }
) => {
  const setTime = () => {
    setState({
      date: new Date(),
    });
  };
  onCreation(setTime);
  onUpdate(setTime);

  const { width, height } = canvas.getSize();

  const millisecond = date.getMilliseconds();
  const second = date.getSeconds() + millisecond / 1000;
  const minute = date.getMinutes() + second / 60;
  const hour = date.getHours() + minute / 60;

  const angleSecond = canvas.getRadiansFromDegrees(second * 6 - 90);
  const angleMinute = canvas.getRadiansFromDegrees(minute * 6 - 90);
  const angleHour = canvas.getRadiansFromDegrees(hour * 30 - 90);

  return (
    <Canvas width={300} height={300} density={DENSITY}>
      <Circle
        x={width / 2}
        y={height / 2}
        radius={width / 2 - PADDING}
        stroke="black"
        strokeWidth={2}
      >
        <Length
          x={width / 2}
          y={height / 2}
          length={width / 4}
          angle={angleHour}
          strokeWidth={2}
          color="grey"
        />
        <Length
          x={width / 2}
          y={height / 2}
          length={width / 3}
          angle={angleMinute}
          strokeWidth={2}
          color="grey"
        />
        <Length
          x={width / 2}
          y={height / 2}
          length={width / 3}
          angle={angleSecond}
          color="grey"
        />
        <Circle x={width / 2} y={height / 2} radius={1} fill="black" />
      </Circle>
    </Canvas>
  );
};

export { Example2 };
