import type { NextPage, GetServerSidePropsContext } from 'next';
import { signIn, getCsrfToken } from 'next-auth/react';
import UserIcon from '~icons/fa/user.jsx';

import Layout from '../../components/Layout';

const Register: NextPage<{ csrfToken: string }> = ({ csrfToken }) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    event.preventDefault();

    await signIn('credentials', {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      _type: 'register',
      callbackUrl: '/',
    });
  }

  return (
    <Layout title="Register">
      <section className="heading">
        <h1>
          <UserIcon /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form
          method="post"
          action="/api/auth/callback/credentials"
          onSubmit={handleSubmit}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              name="_type"
              value="register"
              className="btn btn-block"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}
export default Register;
