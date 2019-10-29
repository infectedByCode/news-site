process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

describe('app.js', () => {
  // Setup for tests
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  // Testing for endpoints
  describe('/api', () => {
    describe('/topics', () => {
      it('GET:200, returns an object with all topics in the database.', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.have.lengthOf(3);
            topics.forEach(topic => {
              expect(topic).to.have.keys(['slug', 'description']);
            });
          });
      });
    });
    describe('/users/:username', () => {
      it('GET:200, returns a user object when given an ID', () => {
        return request(app)
          .get('/api/users/lurker')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys(['username', 'avatar_url', 'name']);
            expect(user.username).to.equal('lurker');
          });
      });
    });
    describe('ERRORS /api', () => {
      it('GET:404, when URL is invalid enpoint ', () => {
        return request(app)
          .get('/api/sdada')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Error 404 - Invalid URL provided.');
          });
      });
    });
  });
});
