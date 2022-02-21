import type { NextPage, GetServerSidePropsContext } from 'next';
import { signIn, getCsrfToken } from 'next-auth/react';
import SignInAltIcon from '~icons/fa-solid/sign-in-alt.jsx';

import Layout from '../../components/Layout';

const Login: NextPage<{ csrfToken: string; callbackUrl?: string }> = ({
  csrfToken,
  callbackUrl = '/',
}) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    event.preventDefault();

    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      callbackUrl,
    });
  }

  return (
    <Layout title="Login">
      <section className="heading">
        <h1>
          <SignInAltIcon /> Login
        </h1>
        <p>Login and start setting goals</p>
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
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              name="_type"
              value="login"
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
  const { callbackUrl = null } = context.query;

  return {
    props: {
      csrfToken,
      callbackUrl,
    },
  };
}
export default Login;
