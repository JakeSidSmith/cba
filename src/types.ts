import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & {
  children?: ReadonlyArray<Element>;
};

export type SetOwnStateCallback<S = {}> = (state: Partial<S>) => Partial<S>;
export type SetOwnState<S = {}> = (
  state: Partial<S> | SetOwnStateCallback<S>
) => void;

export type OnDestroyCallback = () => void;
export type OnCreateCallback = () => void | OnDestroyCallback;
export type OnUpdateCallback<P = {}, S = {}> = (
  prevProps: P & Partial<S>
) => void;
export type ShouldUpdateCallback<P = {}, S = {}> = (
  previousProps: P & Partial<S>
) => boolean;
export type ChildTransform = (canvas: Canvasimo) => void;

export interface Injected<P = {}, S = {}> {
  canvas: Canvasimo;
  setOwnState: SetOwnState<S>;
  onCreate: (callback: OnCreateCallback) => void;
  onUpdate: (callback: OnUpdateCallback<P, S>) => void;
  addChildTransform: (callback: ChildTransform) => void;
  shouldUpdate: (callback: ShouldUpdateCallback<P, S> | boolean) => void;
}

export type Component<P = {}, S = {}, Children = unknown> = ((
  props: P & Partial<S> & { children?: ReadonlyArray<Children> },
  injected: Injected<P, S>
) => Element | ReadonlyArray<Element> | undefined) & { name?: string };

export interface Element<P = {}, S = {}> {
  type: Component<P, S>;
  props: WithChildren<P & Partial<S>>;
}

export interface Node<P = {}, S = {}> {
  element: Element<P, S>;
  state: Partial<S>;
  previousProps: P;
  previousState: Partial<S>;
  rendered: Node | ReadonlyArray<Node> | undefined;
  injected: Injected<P, S>;
  onCreate: OnCreateCallback | undefined;
  onDestroy: OnDestroyCallback | undefined;
  onUpdate: OnUpdateCallback<P, S> | undefined;
  shouldUpdate: ShouldUpdateCallback<P, S> | boolean | undefined;
  childTransforms: ChildTransform[];
}

export type StoreSubscriber<StoreState = {}> = (state: StoreState) => void;
export type StoreUnSubscriber = () => void;

export interface Store<StoreState = {}> {
  subscribe: (callback: StoreSubscriber<StoreState>) => StoreUnSubscriber;
  setStoreState: (newState: Partial<StoreState>) => void;
  getStoreState: () => StoreState;
}

export interface CanvasProps {
  width: number;
  height: number;
  density?: number;
}
