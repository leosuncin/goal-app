import { faker } from '@faker-js/faker';

describe('Register page', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/callback/credentials**').as('register');

    cy.visit('/auth/register');
  });

  it('create a new account', () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = faker.name.fullName({ firstName, lastName });
    const email = faker.internet.email(firstName, lastName).toLocaleLowerCase();
    const password = 'Pa$$w0rd!';

    cy.get('[placeholder="Enter your name"]').type(name);

    cy.get('[placeholder="Enter your email"]').type(email);

    cy.get('[placeholder="Enter password"]').type(password);

    cy.get('[value="register"]').click();

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('equal', '/');
  });

  it('require all of the fields', () => {
    cy.get('[value="register"]').click();

    cy.get('form')
      .then((form) => form[0].checkValidity())
      .should('be.false');
  });
});
