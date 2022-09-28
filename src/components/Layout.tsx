import Head from 'next/head';

import Header from '~app/components/Header';

function Layout({
  children,
  title,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <Header />

      {children}
    </div>
  );
}

export default Layout;
