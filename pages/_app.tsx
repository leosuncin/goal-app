import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { wrapper } from '../lib/store';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
