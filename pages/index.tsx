import type { NextPage } from 'next';
import Head from 'next/head';

import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import Header from '../components/Header';

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

export default Home;
