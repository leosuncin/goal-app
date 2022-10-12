const { faker } = require('@faker-js/faker');
const { getObjectId } = require('mongo-seeding');

/**
 * @type {Array<import('next-auth').User>}
 */
const users = [
  {
    _id: getObjectId('john-doe'),
    name: 'John Doe',
    email: 'john-doe@example.com',
    /* cspell:disable-next-line */
    password: '$2y$12$c7ne7Aqsx0lGgL/P4HYwRu1zybpsDQ7zpzZXbLT9g3Pafwt5eiPDe',
    image: faker.image.avatar(),
  },
  {
    _id: getObjectId('user01'),
    name: faker.name.fullName(),
    email: 'imprudent0869@example.com',
    /* cspell:disable-next-line */
    password: '$2y$12$5Og.21J6jSUkCrlTnrGM3OfIZyAVpwpmVNNxWCXj0t/.W6q7cihW.',
    image: faker.image.avatar(),
  },
];

module.exports = users;
