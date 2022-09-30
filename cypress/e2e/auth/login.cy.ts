import { faker } from '@faker-js/faker';

describe('Login page', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/callback/credentials**').as('login');

    cy.clearCookies().visit('/auth/login');
  });

  it('authenticate with credentials', () => {
    const email = 'john-doe@example.com';
    const password = 'Pa$$w0rd!';

    cy.get('[placeholder="Enter your email"]').type(email);

    cy.get('[placeholder="Enter password"]').type(password);

    cy.get('[value="login"]').click();

    cy.wait('@login').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('equal', '/');
  });

  it('require all of the fields', () => {
    cy.get('[value="login"]').click();

    cy.get('form')
      .then((form) => form[0].checkValidity())
      .should('be.false');
  });

  it('fail to authenticate with invalid credentials', () => {
    const email = faker.internet.email().toLocaleLowerCase();
    const password = faker.internet.password();

    cy.get('[placeholder="Enter your email"]').type(email);

    cy.get('[placeholder="Enter password"]').type(password);

    cy.get('[value="login"]').click();

    cy.wait('@login').its('response.statusCode').should('equal', 401);

    cy.contains('Invalid credentials').should('be.visible');
  });
});
