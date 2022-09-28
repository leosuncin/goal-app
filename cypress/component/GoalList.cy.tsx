import { Provider } from 'react-redux';

import GoalList from '../../src/components/GoalList';
import { createStore } from '../../src/lib/store';

describe('GoalList', () => {
  it('render the list', () => {
    const store = createStore();

    cy.intercept('GET', '**/api/goals', {
      fixture: 'goals.json',
      delay: 200,
    }).as('listGoals');

    cy.mount(
      <Provider store={store}>
        <GoalList />
      </Provider>,
    );

    cy.wait('@listGoals');

    cy.get('.goal').should('have.length', 3);
  });

  it('render an empty list', () => {
    const store = createStore();

    cy.intercept('GET', '**/api/goals', {
      body: [],
    }).as('listGoals');

    cy.mount(
      <Provider store={store}>
        <GoalList />
      </Provider>,
    );

    cy.wait('@listGoals');

    cy.contains('You have not set any goals');
  });
});
