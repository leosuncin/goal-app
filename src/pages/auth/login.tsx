import type { NextPage, GetServerSidePropsContext } from 'next';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SignInAltIcon from '~icons/fa-solid/sign-in-alt.jsx';

import Layout from '~app/components/Layout';

type LoginProps = { csrfToken: string; callbackUrl?: string; error?: string };

const Login: NextPage<LoginProps> = ({
  csrfToken,
  callbackUrl = '/',
  error,
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

  useEffect(() => {
    if (error === 'CredentialsSignin') {
      toast.error('Invalid credentials');
    }
  }, [error]);

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
              autoComplete="current-password"
              required
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
  let { callbackUrl, error } = context.query;

  if (Array.isArray(callbackUrl)) callbackUrl = callbackUrl[0];

  if (Array.isArray(error)) error = error[0];

  return {
    props: {
      csrfToken,
      ...(callbackUrl ? { callbackUrl } : {}),
      ...(error ? { error } : {}),
    },
  };
}
export default Login;
