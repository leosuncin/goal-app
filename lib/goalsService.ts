import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = `${
  process.env.VERCEL_URL ?? 'http://localhost:3000'
}/api/goals`;

export type Goal = {
  _id: string;
  text: string;
  createdAt: string;
};

export type CreateGoal = Pick<Goal, 'text'>;

export type UpdateGoal = Pick<Goal, '_id' | 'text'>;

const goalsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  reducerPath: 'goalsApi',
  tagTypes: ['Goal'],
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
