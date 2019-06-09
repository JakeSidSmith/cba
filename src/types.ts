import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & { children?: ReadonlyArray<Element> };

export type SetStateCallback<S = {}> = (state: Partial<S>) => Partial<S>;
export type SetState<S = {}> = (
  state: Partial<S> | SetStateCallback<S>
) => void;

export type OnDestroyCallback = () => void;
export type OnCreationCallback = () => void | OnDestroyCallback;
export type OnUpdateCallback<P = {}, S = {}> = (
  prevProps: P & Partial<S>
) => void;
export type ChildTransform = (canvas: Canvasimo) => void;

export interface Injected<P = {}, S = {}> {
  canvas: Canvasimo;
  setState: SetState<S>;
  onCreation: (callback: OnCreationCallback) => void;
  onUpdate: (callback: OnUpdateCallback<P, S>) => void;
  addChildTransform: (callback: ChildTransform) => void;
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
  element: Element<P, S>;
  previousProps: P & Partial<S>;
  rendered: Node | ReadonlyArray<Node> | undefined;
  injected: Injected<P, S>;
  onCreation: OnCreationCallback | undefined;
  onDestroy: OnDestroyCallback | undefined;
  onUpdate: OnUpdateCallback<P, S> | undefined;
  childTransforms: ChildTransform[];
}
