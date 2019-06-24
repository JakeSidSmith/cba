import Canvasimo from 'canvasimo';
import { CANVAS_TYPE } from './internal/constants';

export type WithChildren<GivenProps> = GivenProps & {
  children?: ReadonlyArray<Element>;
};

export type SetOwnPropsCallback<OwnProps = {}> = (
  state: Partial<OwnProps>
) => Partial<OwnProps>;
export type SetOwnProps<OwnProps = {}> = (
  state: Partial<OwnProps> | SetOwnPropsCallback<OwnProps>
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
  setOwnProps: SetOwnProps<OwnProps>;
  onCreate: (callback: OnCreateCallback) => void;
  onUpdate: (callback: OnUpdateCallback<GivenProps, OwnProps>) => void;
  addChildTransform: (callback: ChildTransform) => void;
  shouldUpdate: (
    callback: ShouldUpdateCallback<GivenProps, OwnProps> | boolean
  ) => void;
}

export interface ComponentProperties {
  _type?: string;
  name?: string;
}

export type Component<GivenProps = {}, OwnProps = {}, Children = unknown> = ((
  props: GivenProps &
    Partial<OwnProps> & { children?: ReadonlyArray<Children> },
  injected: Injected<GivenProps, OwnProps>
) => Element | ReadonlyArray<Element> | undefined) &
  ComponentProperties;

export interface CanvasComponent extends Component<CanvasProps, {}, Element> {
  _type: typeof CANVAS_TYPE;
}

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
