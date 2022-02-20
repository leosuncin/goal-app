import {
  configureStore,
  PreloadedState,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createWrapper } from 'next-redux-wrapper';

import goalsApi from './goalsApi';

export function createStore(preloadedState?: PreloadedState<AppState>) {
  const store = configureStore({
    reducer: {
      [goalsApi.reducerPath]: goalsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(goalsApi.middleware),
    preloadedState,
  });

  setupListeners(store.dispatch);

  return store;
}

export type AppState = {
  [goalsApi.reducerPath]: ReturnType<typeof goalsApi['reducer']>;
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
