import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & { children?: ReadonlyArray<Element> };

export type Component<P = {}> = ((
  props: WithChildren<P>,
  injected: { canvas: Canvasimo }
) => Element | ReadonlyArray<Element> | undefined) & { name?: string };

export interface Element<P = {}> {
  type: Component<P>;
  props: WithChildren<P>;
}

export interface Node<P = {}> {
  type: Component<P>;
  canvasElement?: HTMLCanvasElement;
  canvas?: Canvasimo;
  previousProps: P;
  rendered: Node | ReadonlyArray<Node> | undefined;
}
