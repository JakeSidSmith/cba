import Canvasimo from 'canvasimo';

export type WithChildren<P> = P & {
  children?: ReadonlyArray<Element>;
};

export type SetStateCallback<S = {}> = (state: Partial<S>) => Partial<S>;
export type SetState<S = {}> = (
  state: Partial<S> | SetStateCallback<S>
) => void;

export type OnDestroyCallback = () => void;
export type OnCreationCallback = () => void | OnDestroyCallback;
export type OnUpdateCallback<P = {}, S = {}> = (
  prevProps: P & Partial<S>
) => void;
export type ShouldUpdateCallback<P = {}, S = {}> = (
  previousProps: P & Partial<S>
) => boolean;
export type ChildTransform = (canvas: Canvasimo) => void;

export interface Injected<P = {}, S = {}> {
  canvas: Canvasimo;
  setState: SetState<S>;
  onCreation: (callback: OnCreationCallback) => void;
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
  onCreation: OnCreationCallback | undefined;
  onDestroy: OnDestroyCallback | undefined;
  onUpdate: OnUpdateCallback<P, S> | undefined;
  shouldUpdate: ShouldUpdateCallback<P, S> | boolean | undefined;
  childTransforms: ChildTransform[];
}

export type StoreSubscriber<C = {}> = (context: C) => void;
export type StoreUnSubscriber = () => void;

export interface Store<C = {}> {
  subscribe: (callback: StoreSubscriber<C>) => StoreUnSubscriber;
  setStoreState: (newState: Partial<C>) => void;
  getStoreState: () => C;
}

export interface ProviderProps<C = {}> {
  context: C;
}

export interface ConsumerProps<C = {}> {
  children?: [(context: C) => Element | ReadonlyArray<Element> | undefined];
}

export interface ConsumerState<C> {
  context: C;
}

export interface CanvasProps {
  width: number;
  height: number;
  density?: number;
}
