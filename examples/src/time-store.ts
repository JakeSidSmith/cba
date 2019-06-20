import { createStore } from 'cba';

export interface StoreState {
  time: string;
}

export const timeStore = createStore<StoreState>({
  time: new Date().toString(),
});
