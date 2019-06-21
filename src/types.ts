import Canvasimo from 'canvasimo';

export type WithChildren<GivenProps> = GivenProps & {
  children?: ReadonlyArray<Element>;
};

export type SetOwnStateCallback<OwnProps = {}> = (
  state: Partial<OwnProps>
) => Partial<OwnProps>;
export type SetOwnState<OwnProps = {}> = (
  state: Partial<OwnProps> | SetOwnStateCallback<OwnProps>
) => void;

export type OnDestroyCallback = () => void;
export type OnCreateCallback = () => void | OnDestroyCallback;
export type OnUpdateCallback<GivenProps = {}, OwnProps = {}> = (
  prevProps: GivenProps & Partial<OwnProps>
) => void;
export type ShouldUpdateCallback<GivenProps = {}, OwnProps = {}> = (
  previousProps: GivenProps & Partial<OwnProps>
) => boolean;
export type ChildTransform = (canvas: Canvasimo) => void;

export interface Injected<GivenProps = {}, OwnProps = {}> {
  canvas: Canvasimo;
  setOwnState: SetOwnState<OwnProps>;
  onCreate: (callback: OnCreateCallback) => void;
  onUpdate: (callback: OnUpdateCallback<GivenProps, OwnProps>) => void;
  addChildTransform: (callback: ChildTransform) => void;
  shouldUpdate: (
    callback: ShouldUpdateCallback<GivenProps, OwnProps> | boolean
  ) => void;
}

export type Component<GivenProps = {}, OwnProps = {}, Children = unknown> = ((
  props: GivenProps &
    Partial<OwnProps> & { children?: ReadonlyArray<Children> },
  injected: Injected<GivenProps, OwnProps>
) => Element | ReadonlyArray<Element> | undefined) & { name?: string };

export interface Element<GivenProps = {}, OwnProps = {}> {
  type: Component<GivenProps, OwnProps>;
  props: WithChildren<GivenProps & Partial<OwnProps>>;
}

export interface Node<GivenProps = {}, OwnProps = {}> {
  element: Element<GivenProps, OwnProps>;
  state: Partial<OwnProps>;
  previousProps: GivenProps;
  previousState: Partial<OwnProps>;
  rendered: Node | ReadonlyArray<Node> | undefined;
  injected: Injected<GivenProps, OwnProps>;
  onCreate: OnCreateCallback | undefined;
  onDestroy: OnDestroyCallback | undefined;
  onUpdate: OnUpdateCallback<GivenProps, OwnProps> | undefined;
  shouldUpdate:
    | ShouldUpdateCallback<GivenProps, OwnProps>
    | boolean
    | undefined;
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
