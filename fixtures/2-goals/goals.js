const { faker } = require('@faker-js/faker');
const { getObjectId } = require('mongo-seeding');

/**
 * @typedef {object} Goal
 * @property {ObjectId} _id
 * @property {String} text
 * @property {ObjectId} author
 * @property {Date} createdAt
 */

/**
 * @type {Array<Goal>}
 */
const goals = [
  {
    _id: getObjectId('goal01'),
    text: 'Make a sandwich',
    author: getObjectId('john-doe'),
  },
  {
    _id: getObjectId('goal02'),
    text: 'Make a salad',
    author: getObjectId('john-doe'),
  },
  {
    _id: getObjectId('goal03'),
    text: 'Buy milk',
    author: getObjectId('john-doe'),
  },
  {
    _id: getObjectId('goal04'),
    text: faker.lorem.sentence(),
    author: getObjectId('user01'),
  },
  {
    _id: getObjectId('goal05'),
    text: faker.lorem.sentence(),
    author: getObjectId('user01'),
  },
];

module.exports = goals;
