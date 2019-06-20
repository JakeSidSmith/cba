import { Component } from 'cba';

let then = Date.now();
const prevNows: number[] = [];

const FPS: Component = (_, { canvas, shouldUpdate }) => {
  shouldUpdate(true);

  const now = Date.now();

  if (prevNows.length === 20) {
    prevNows.shift();
  }

  if (prevNows.length < 20) {
    prevNows.push(1000 / (now - then));
  }

  const fps =
    prevNows.reduce((memo, prevNow) => memo + prevNow, 0) / prevNows.length;

  canvas.fillText(`FPS: ${fps.toFixed(2)}`, 30, 60, null, 'black');

  then = now;

  return undefined;
};

export { FPS };
