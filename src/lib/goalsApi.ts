import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import type { ThunksExtraArgument } from '~app/lib/store';

const baseUrl = `${
  process.env.VERCEL_URL ?? 'http://localhost:3000'
}/api/goals`;

export type Goal = {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
};

export type CreateGoal = Pick<Goal, 'text'>;

export type UpdateGoal = Pick<Goal, '_id' | 'text'>;

const goalsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { extra }) => {
      const token = (extra as ThunksExtraArgument).getToken();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  refetchOnFocus: true,
  reducerPath: 'goalsApi',
  tagTypes: ['Goal'],
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    create: builder.mutation<Goal, CreateGoal>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Goal', id: 'LIST' }],
    }),
    list: builder.query<Goal[], void>({
      query: () => '',
      providesTags: [{ type: 'Goal', id: 'LIST' }],
    }),
    update: builder.mutation<Goal, UpdateGoal>({
      query: ({ _id, text }) => ({
        url: `/${_id}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: [{ type: 'Goal', id: 'LIST' }],
    }),
    remove: builder.mutation<undefined, Goal['_id']>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Goal', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateMutation,
  useLazyListQuery,
  useListQuery,
  usePrefetch,
  useRemoveMutation,
  useUpdateMutation,
} = goalsApi;

export default goalsApi;
