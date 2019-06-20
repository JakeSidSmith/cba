import { createElement } from './create-element';
import { Component, Element, Store } from './types';

export function connect<StoreProps = {}, OwnProps = {}, StoreState = {}>(
  store: Store<StoreState>,
  mapStoreState: (state: StoreState) => StoreProps
) {
  return (
    component: Component<StoreProps & OwnProps>
  ): Component<OwnProps, StoreProps> => {
    const ConnectedComponent: Component<OwnProps, StoreProps, Element> = (
      props,
      { onCreate, setOwnState }
    ) => {
      onCreate(() => {
        return store.subscribe(newState => {
          setOwnState(mapStoreState(newState));
        });
      });

      return (createElement(component, {
        ...mapStoreState(store.getStoreState()),
        ...props,
      }) as unknown) as Element;
    };

    return ConnectedComponent;
  };
}
