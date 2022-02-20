import type { NextPage } from 'next';
import Head from 'next/head';

import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import Header from '../components/Header';
import goalsApi from '../lib/goalsApi';
import { wrapper } from '../lib/store';

const Home: NextPage = () => {
  return (
    <div className="container">
      <Head>
        <title>Goals Dashboard</title>
      </Head>
      <Header />

      <section className="heading">
        <h1>Welcome</h1>
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
  (store) => async () => {
    store.dispatch(goalsApi.endpoints.list.initiate());

    await Promise.all(goalsApi.util.getRunningOperationPromises());

    return {
      props: {},
    };
  }
);

export default Home;
