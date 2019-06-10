import Canvasimo from 'canvasimo';

export function createCanvas() {
  const canvasElement = document.createElement('canvas');
  jest.spyOn(canvasElement, 'getContext').mockImplementation((type: string) => {
    if (type !== '2d') {
      throw new Error('Invalid attempted to get context other than 2d');
    }

    return ({
      // Prevents unsupported warnings
      setLineDash: jest.fn(),
      getLineDash: jest.fn(),
    } as unknown) as CanvasRenderingContext2D;
  });
  const canvas = new Canvasimo(canvasElement);

  return {
    canvasElement,
    canvas,
  };
}
