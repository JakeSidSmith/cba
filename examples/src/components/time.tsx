/* @jsx cba.createElement */

import cba, { Component } from 'cba';
import { TimeContext, TimeProps } from '../time-context';
import { Text } from './text';

const Time: Component = () => {
  return (
    <TimeContext.Consumer>
      {({ time }: TimeProps) => {
        return <Text x={30} y={40} text={time} fill="black" />;
      }}
    </TimeContext.Consumer>
  );
};

export { Time };
