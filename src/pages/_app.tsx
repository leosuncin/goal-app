import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '~app/styles/globals.css';
import { wrapper } from '~app/lib/store';

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { session } = props.pageProps;

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...props.pageProps} />
        <ToastContainer />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
