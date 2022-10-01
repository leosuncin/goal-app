/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.request('/api/auth/csrf')
        .its('body.csrfToken')
        .then((csrfToken: string) =>
          cy.request({
            method: 'POST',
            url: '/api/auth/callback/credentials',
            body: {
              email,
              password,
              callbackUrl: '/',
              csrfToken,
            },
            form: true,
          }),
        );
    },
    {
      validate() {
        cy.request('/api/auth/session').its('isOkStatusCode').should('be.true');
      },
    },
  );
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}
export {};
