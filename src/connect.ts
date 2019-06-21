import { createElement } from './create-element';
import { Component, Element, Store } from './types';

export function connect<StoreProps = {}, GivenProps = {}, StoreState = {}>(
  store: Store<StoreState>,
  mapStoreStateToProps: (state: StoreState) => StoreProps
) {
  return (
    component: Component<StoreProps & GivenProps>
  ): Component<GivenProps, StoreProps> => {
    const ConnectedComponent: Component<GivenProps, StoreProps> = (
      props,
      { onCreate, setOwnProps }
    ) => {
      onCreate(() => {
        return store.subscribe(newState => {
          setOwnProps(mapStoreStateToProps(newState));
        });
      });

      return (createElement(component, {
        ...mapStoreStateToProps(store.getStoreState()),
        ...props,
      }) as unknown) as Element;
    };

    return ConnectedComponent;
  };
}
