process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
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
    describe('/api/topics', () => {
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
  });
  describe('/api ERRORS', () => {
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
