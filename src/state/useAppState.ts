import { useSyncExternalStore } from 'react';
import { store } from './axesStore';

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.getState);
}
