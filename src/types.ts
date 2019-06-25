import Canvasimo from 'canvasimo';
import {
  CANVAS_TYPE,
  CONTEXT_CONSUMER_TYPE,
  CONTEXT_PROVIDER_TYPE,
} from './internal/constants';

export type WithChildren<GivenProps> = GivenProps & {
  children?: ReadonlyArray<Element>;
};

export type NoChildren<Props extends {}> = Pick<
  Props,
  Exclude<keyof Props, 'children'>
>;

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

export interface BaseComponent<GivenProps = {}, OwnProps = {}> {
  (
    props: GivenProps & Partial<OwnProps>,
    injected: Injected<GivenProps, OwnProps>
  ): Element | ReadonlyArray<Element> | undefined;
  name?: string;
  _type?: string;
}

export interface Component<GivenProps = {}, OwnProps = {}>
  extends BaseComponent<GivenProps, OwnProps> {
  _type?: never;
}

export interface CanvasComponent<GivenProps = {}, OwnProps = {}>
  extends BaseComponent<GivenProps, OwnProps> {
  name?: string;
  _type: typeof CANVAS_TYPE;
}

export interface ContextProviderComponent<Context = {}> {
  (
    context: WithChildren<Context>,
    setContext: (
      contextId: number,
      initialContext: Context,
      context: NoChildren<Context>
    ) => void
  ): Element | ReadonlyArray<Element> | undefined;
  name?: string;
  _type: typeof CONTEXT_PROVIDER_TYPE;
  _contextId: number;
}

export interface ContextConsumerComponent<Context = {}> {
  (props: ContextConsumerProps<Context>, context: Context):
    | Element
    | ReadonlyArray<Element>
    | undefined;
  name?: string;
  _type: typeof CONTEXT_CONSUMER_TYPE;
  _contextId: number;
}

export type ComponentType<GivenProps = {}, OwnProps = {}> =
  | Component<GivenProps, OwnProps>
  | CanvasComponent<GivenProps, OwnProps>
  | ContextProviderComponent<GivenProps>
  | ContextConsumerComponent<GivenProps>;

export interface Element<GivenProps = {}, OwnProps = {}> {
  type: ComponentType<GivenProps, OwnProps>;
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
  children?: ReadonlyArray<Element>;
}

export type ContextConsumerChild<Context = {}> = (
  context: Context
) => Element | ReadonlyArray<Element> | undefined;

export interface ContextConsumerProps<Context = {}> {
  children?: [ContextConsumerChild<NoChildren<Context>> | undefined];
}
