import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & { children?: ReadonlyArray<Element> };

export interface Injected<P = {}, S = {}> {
  canvas: Canvasimo;
  setState: (state: Partial<S> | ((state: Partial<S>) => Partial<S>)) => void;
  onCreation: (callback: () => void | (() => void)) => void;
  onUpdate: (callback: (prevProps: P & Partial<S>) => void) => void;
}

export type Component<P = {}, S = {}> = ((
  props: WithChildren<P & Partial<S>>,
  injected: Injected<P, S>
) => Element | ReadonlyArray<Element> | undefined) & { name?: string };

export interface Element<P = {}, S = {}> {
  type: Component<P, S>;
  props: WithChildren<P & Partial<S>>;
}

export interface Node<P = {}, S = {}> {
  type: Component<P, S>;
  previousProps: P & Partial<S>;
  rendered: Node | ReadonlyArray<Node> | undefined;
  injected: Injected<P, S>;
  onCreation: (() => void | (() => void)) | undefined;
  onDestroy: (() => void) | undefined;
  onUpdate: ((props: P & Partial<S>) => void) | undefined;
}
