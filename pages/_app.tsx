import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css';
import { wrapper } from '../lib/store';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default wrapper.withRedux(MyApp);
