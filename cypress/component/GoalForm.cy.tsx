import { StatusCodes } from 'http-status-codes';
import { Provider } from 'react-redux';

import GoalForm from '~app/components/GoalForm';
import { createStore } from '~app/lib/store';

describe('GoalForm', () => {
  const text = 'Make a sandwich';

  beforeEach(() => {
    cy.intercept('POST', '**/api/goals', {
      statusCode: StatusCodes.CREATED,
      body: {
        _id: '6333b5c9d39198575e0e04a6',
        text,
        createdAt: new Date().toISOString(),
        author: '6333b7d2d39198575e0e04a9',
      },
    }).as('createGoal');
  });

  it('render the form', () => {
    const store = createStore();

    cy.mount(
      <Provider store={store}>
        <GoalForm />
      </Provider>,
    );
  });

  it('submit a new goal', () => {
    const store = createStore();

    cy.mount(
      <Provider store={store}>
        <GoalForm />
      </Provider>,
    );

    cy.get('input[type=text]').type(text);

    cy.get('button[type=submit]').click();

    cy.wait('@createGoal');

    cy.get('input[type=text]').should('be.empty');
  });

  it('require that the text is not empty', () => {
    const store = createStore();

    cy.mount(
      <Provider store={store}>
        <GoalForm />
      </Provider>,
    );

    cy.get('button[type=submit]').click();

    cy.get('input[type=text]')
      .then((input) => input.is(':invalid'))
      .should('be.true');
  });
});
