import { faker } from '@faker-js/faker';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

describe('Goal REST API', () => {
  const author = {
    id: '0497fe4d674fe37194a6fcb0',
    email: 'imprudent0869@example.com',
  };

  beforeEach(() => {
    cy.login(author.email, 'Pa$$w0rd!');
  });

  it('create a new goal', () => {
    const body = {
      text: faker.lorem.sentence(),
    };

    cy.api({
      url: '/api/goals',
      method: 'POST',
      body,
    }).should((response) => {
      expect(response.status).to.be.equal(StatusCodes.CREATED);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('text', body.text);
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.have.property('author');
    });
  });

  it('find all the goals', () => {
    cy.api('/api/goals').should((response) => {
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length.at.least(1);
    });
  });

  it('update a goal', () => {
    const body = {
      text: faker.lorem.sentence(),
    };

    cy.insertGoal(faker.lorem.words(), author).then((task) => {
      cy.api({
        url: `/api/goals/${task._id}`,
        method: 'PUT',
        body,
      }).should((response) => {
        expect(response.status).to.be.equal(StatusCodes.OK);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('text', body.text);
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('author');
      });
    });
  });

  it('delete a goal', () => {
    cy.insertGoal(faker.lorem.words(), author).then((task) => {
      cy.api({
        url: `/api/goals/${task._id}`,
        method: 'DELETE',
      }).should((response) => {
        expect(response.status).to.be.equal(StatusCodes.NO_CONTENT);
        expect(response.body).to.be.empty;
      });
    });
  });

  it('require the text to create a new goal', () => {
    cy.api({
      url: '/api/goals',
      method: 'POST',
      body: {},
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).to.deep.equal({
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: 'Validation errors',
        errors: {
          text: ['Please add a text value'],
        },
      });
    });
  });

  it('require that the text must be a string', () => {
    cy.api({
      url: '/api/goals/8e0de247ef4c40334a42e020',
      method: 'PUT',
      body: { text: false },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).to.deep.equal({
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: 'Validation errors',
        errors: {
          text: ['The text value should be a string'],
        },
      });
    });
  });

  it.each(['PUT', 'DELETE'])('fail to %s when the goal not exist', (method) => {
    const id = faker.database.mongodbObjectId();

    cy.api({
      url: `/api/goals/${id}`,
      method,
      body: { text: '' },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(response.body).to.deep.equal({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: `There isn't any goal with id: ${id}`,
      });
    });
  });

  it.each(['PUT', 'DELETE'])('fail to %s with an invalid id', (method) => {
    cy.api({
      url: `/api/goals/${faker.datatype.uuid()}`,
      method,
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(response.body).to.deep.equal({
        statusCode: StatusCodes.BAD_REQUEST,
        code: ReasonPhrases.BAD_REQUEST,
        message: 'The id must be a valid ObjectId',
      });
    });
  });
});
