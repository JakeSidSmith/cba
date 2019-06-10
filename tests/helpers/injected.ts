import Canvasimo from 'canvasimo';
import { Injected } from 'cba';

const createInjected = <P = {}, S = {}>() => {
  const element = document.createElement('canvas');
  jest.spyOn(element, 'getContext').mockImplementation((type: string) => {
    if (type !== '2d') {
      throw new Error('Invalid attempted to get context other than 2d');
    }

    return ({
      // Prevents unsupported warnings
      setLineDash: jest.fn(),
      getLineDash: jest.fn(),
    } as unknown) as CanvasRenderingContext2D;
  });
  const canvas = new Canvasimo(element);

  const injected: Injected<P, S> = {
    canvas,
    setState: jest.fn(),
    onCreation: jest.fn(),
    onUpdate: jest.fn(),
    addChildTransform: jest.fn(),
  };

  return injected;
};

export { createInjected };
