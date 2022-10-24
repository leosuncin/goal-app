import type { NextPage } from 'next';
import { useSession, getSession } from 'next-auth/react';

import GoalForm from '~app/components/GoalForm';
import GoalList from '~app/components/GoalList';
import Layout from '~app/components/Layout';
import goalsApi from '~app/lib/goalsApi';
import { wrapper } from '~app/lib/store';

const Home: NextPage = () => {
  const { data: session } = useSession({ required: true });

  return (
    <Layout title="Goals Dashboard">
      <section className="heading">
        <h1>Welcome {session?.user?.name}</h1>
        <p>Goals Dashboard</p>
      </section>

      <GoalForm />

      <section className="content">
        <GoalList />
      </section>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: true,
        },
      };
    }

    store.dispatch(goalsApi.endpoints.list.initiate());

    await Promise.all(store.dispatch(goalsApi.util.getRunningQueriesThunk()));

    return {
      props: {
        session,
      },
    };
  },
);

export default Home;
