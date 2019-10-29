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
      it('GET:200, returns a user object when given a valid ID', () => {
        return request(app)
          .get('/api/users/lurker')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys(['username', 'avatar_url', 'name']);
            expect(user.username).to.equal('lurker');
          });
      });
      describe('ERRORS', () => {
        it('GET:404, when username does not exist', () => {
          return request(app)
            .get('/api/users/apple')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Username "apple" cannot be found.');
            });
        });
      });
    });
    describe('/articles/:article_id', () => {
      it('GET:200, returns an article object when given a valid article ID.', () => {
        return request(app)
          .get('/api/articles/5')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys([
              'author',
              'title',
              'id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            ]);
            expect(article.id).to.equal(5);
            expect(article.comment_count).to.equal('2');
          });
      });
      it('PATCH:201, returns the updated article when given a valid object of { inc_votes: newVote } is given', () => {
        const updateReq = { inc_votes: 23 };

        return request(app)
          .patch('/api/articles/1')
          .send(updateReq)
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(123);
          });
      });
      describe('ERRORS /articles/:article_id', () => {
        it('GET:400, when article ID is incorrect data type', () => {
          return request(app)
            .get('/api/articles/not-an-id')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('invalid input syntax for integer: "not-an-id"');
            });
        });
        it('GET:404, when article ID is a valid data type, but not found', () => {
          return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Article ID "99999" does not exist.');
            });
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
