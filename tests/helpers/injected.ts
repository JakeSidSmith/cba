import { Injected } from 'cba';
import { createCanvas } from './canvas';

export function createInjected<GivenProps = {}, OwnProps = {}>() {
  const { canvas } = createCanvas();

  const injected: Injected<GivenProps, OwnProps> = {
    canvas,
    setOwnProps: jest.fn(),
    onCreate: jest.fn(),
    onUpdate: jest.fn(),
    shouldUpdate: jest.fn(),
    addChildTransform: jest.fn(),
  };

  return injected;
}
