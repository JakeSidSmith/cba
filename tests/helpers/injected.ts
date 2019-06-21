import { Injected } from 'cba';
import { createCanvas } from './canvas';

export function createInjected<P = {}, S = {}>() {
  const { canvas } = createCanvas();

  const injected: Injected<P, S> = {
    canvas,
    setOwnProps: jest.fn(),
    onCreate: jest.fn(),
    onUpdate: jest.fn(),
    shouldUpdate: jest.fn(),
    addChildTransform: jest.fn(),
  };

  return injected;
}
