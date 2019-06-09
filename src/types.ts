import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & { children?: ReadonlyArray<Element> };

export interface Injected<S> {
  canvas: Canvasimo;
  setState: (state: Partial<S>) => void;
}

export type Component<P = {}, S = {}> = ((
  props: WithChildren<P & Partial<S>>,
  injected: Injected<S>
) => Element | ReadonlyArray<Element> | undefined) & { name?: string };

export interface Element<P = {}, S = {}> {
  type: Component<P, S>;
  props: WithChildren<P & Partial<S>>;
}

export interface Node<P = {}, S = {}> {
  type: Component<P, S>;
  previousProps: P & Partial<S>;
  rendered: Node | ReadonlyArray<Node> | undefined;
  injected: Injected<S>;
}
