import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import Header from '~app/components/Header';

describe('Header', () => {
  it('render without a session', () => {
    cy.mount(
      <SessionProvider>
        <Header />
      </SessionProvider>,
    );

    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });

  it('render with a session', () => {
    const session: Session = {
      user: { name: 'Bradley Weeks', email: 'qivatux@ceto.com' },
      expires: '2022-10-28T05:36:08.110Z',
    };

    cy.mount(
      <SessionProvider session={session}>
        <Header />
      </SessionProvider>,
    );

    cy.contains('Logout').should('be.visible');
  });
});
