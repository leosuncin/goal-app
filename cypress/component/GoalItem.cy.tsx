import { StatusCodes } from 'http-status-codes';
import { Provider } from 'react-redux';

import GoalItem from '~app/components/GoalItem';
import { createStore } from '~app/lib/store';

const goal = {
  _id: '6333b5c9d39198575e0e04a6',
  text: 'Make a sandwich',
  createdAt: '2022-09-28T04:39:01.725Z',
  author: '6333b7d2d39198575e0e04a9',
};

describe('GoalItem', () => {
  beforeEach(() => {
    cy.intercept('DELETE', '**/api/goals/**', {
      statusCode: StatusCodes.NO_CONTENT,
    }).as('removeGoal');
  });

  it('render the goal', () => {
    const store = createStore();

    cy.mount(
      <Provider store={store}>
        <GoalItem goal={goal} />
      </Provider>,
    );

    cy.contains(goal.text).should('be.visible');
  });

  it('remove the goal', () => {
    const store = createStore();

    cy.mount(
      <Provider store={store}>
        <GoalItem goal={goal} />
      </Provider>,
    );

    cy.get('button').click();

    cy.wait('@removeGoal')
      .its('response.statusCode')
      .should('equal', StatusCodes.NO_CONTENT);
  });
});
