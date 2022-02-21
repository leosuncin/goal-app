import type { NextPage } from 'next';
import { useSession, getSession } from 'next-auth/react';

import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import Layout from '../components/Layout';
import goalsApi from '../lib/goalsApi';
import { wrapper } from '../lib/store';

const Home: NextPage = () => {
  const { data: session } = useSession();
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
    store.dispatch(goalsApi.endpoints.list.initiate());

    await Promise.all(goalsApi.util.getRunningOperationPromises());

    return {
      props: {
        session,
      },
    };
  }
);

export default Home;
