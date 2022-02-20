import {
  configureStore,
  PreloadedState,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createWrapper } from 'next-redux-wrapper';

import goalsService from './goalsService';

export function createStore(preloadedState?: PreloadedState<AppState>) {
  const store = configureStore({
    reducer: {
      [goalsService.reducerPath]: goalsService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(goalsService.middleware),
    preloadedState,
  });

  setupListeners(store.dispatch);

  return store;
}

export type AppState = {
  [goalsService.reducerPath]: ReturnType<typeof goalsService['reducer']>;
};

export type AppStore = ReturnType<typeof createStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = unknown> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(() => createStore(), {
  debug: process.env.NODE_ENV === 'development',
});
