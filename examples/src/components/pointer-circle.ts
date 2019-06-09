import { Component } from 'cba';

export interface PointerCircleState {
  x: number;
  y: number;
}

const PointerCircle: Component<{}, PointerCircleState> = (
  { children, x, y },
  { canvas, onCreation, setState }
) => {
  onCreation(() => {
    const onMouseMove = (event: MouseEvent) => {
      const rect = (document.getElementById(
        'app'
      ) as HTMLElement).getBoundingClientRect();

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

export { PointerCircle };
