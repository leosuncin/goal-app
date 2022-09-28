import {
  configureStore,
  PreloadedState,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { GetServerSidePropsContext } from 'next';
import { getToken } from 'next-auth/jwt';
import { createWrapper, type Context } from 'next-redux-wrapper';

import goalsApi from './goalsApi';

type CreateStoreParams = {
  preloadedState?: PreloadedState<AppState>;
  getToken?: () => string;
};

export function createStore({
  preloadedState,
  getToken = () => '',
}: CreateStoreParams = {}) {
  const store = configureStore({
    reducer: {
      [goalsApi.reducerPath]: goalsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: { getToken } },
      }).concat(goalsApi.middleware),
    preloadedState,
  });

  setupListeners(store.dispatch);

  return store;
}

function isServerSideContext(
  context: Context,
): context is GetServerSidePropsContext {
  return 'req' in context && Boolean(context.req);
}

export type ThunksExtraArgument = {
  getToken: () => string;
};

export type AppState = {
  [goalsApi.reducerPath]: ReturnType<typeof goalsApi['reducer']>;
};

export type AppStore = ReturnType<typeof createStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = unknown> = ThunkAction<
  ReturnType,
  AppState,
  ThunksExtraArgument,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>((context) => {
  let token = '';

  if (isServerSideContext(context)) {
    getToken({
      raw: true,
      secret: process.env.NEXTAUTH_SECRET,
      req: context.req,
    }).then((jwt) => {
      token = jwt;
    });
  }

  return createStore({
    getToken: () => token,
  });
});
