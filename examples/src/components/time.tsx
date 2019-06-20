/* @jsx cba.createElement */

import cba, { connect } from 'cba';
import { StoreState, timeStore } from '../time-store';
import { Text } from './text';

type StoreProps = Pick<StoreState, 'time'>;

const mapStoreState = ({ time }: StoreState) => ({ time });

const Time = connect(
  timeStore,
  mapStoreState
)((props: StoreProps) => (
  <Text x={30} y={40} fill="black">
    {props.time}
  </Text>
));

export { Time };
