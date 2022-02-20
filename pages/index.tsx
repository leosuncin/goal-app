import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession, getSession } from 'next-auth/react';

import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import Header from '../components/Header';
import goalsApi from '../lib/goalsApi';
import { wrapper } from '../lib/store';

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <div className="container">
      <Head>
        <title>Goals Dashboard</title>
      </Head>
      <Header />

      <section className="heading">
        <h1>Welcome {session?.user?.name}</h1>
        <p>Goals Dashboard</p>
      </section>

      <GoalForm />

      <section className="content">
        <GoalList />
      </section>
    </div>
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
