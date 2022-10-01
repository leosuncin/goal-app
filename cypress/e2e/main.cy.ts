import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Main page', () => {
  const text = faker.lorem.words();

  beforeEach(() => {
    cy.login('john-doe@example.com', 'Pa$$w0rd!');

    cy.intercept({
      method: 'POST',
      url: '**/api/goals',
    }).as('createGoal');
    cy.intercept({
      method: 'GET',
      url: '**/api/goals',
    }).as('listGoals');
    cy.intercept({
      method: 'DELETE',
      url: '**/api/goals/**',
    }).as('removeGoal');

    cy.visit('/');
  });

  it('show the name of the user', () => {
    cy.get('.heading h1').should('contain.text', 'John Doe');
  });

  it('show the list of goals', () => {
    cy.get('.goal').should('have.length', 3);
  });

  it('create a new goal', () => {
    cy.get('[name="text"]').type(text);

    cy.get('button[type=submit]').click();

    cy.wait('@createGoal')
      .its('response.statusCode')
      .should('equal', StatusCodes.CREATED);
    cy.wait('@listGoals');

    cy.get('.goal').should('have.length', 4);
    cy.contains(text).should('be.visible');
  });

  it('remove one goal', () => {
    cy.get('.goal')
      .last()
      .within(() => {
        cy.get('button').click();

        cy.wait('@removeGoal')
          .its('response.statusCode')
          .should('equal', StatusCodes.NO_CONTENT);
        cy.wait('@listGoals');
      });

    cy.get('.goal').should('have.length', 3);
    cy.get('.goal').last().should('not.contain.text', text);
  });

  it('close the session', () => {
    cy.contains('Logout').click();

    cy.location('pathname').should('equal', '/auth/login');
  });
});
