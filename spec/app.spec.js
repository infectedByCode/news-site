process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);

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
        it('GET:400, when username is greater than max allowed', () => {
          return request(app)
            .get('/api/users/applesaregreenandredbutnotblue')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Usernames should be less than 20 characters. Please check and try again.');
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
        it('PATCH:400, when the body does not contain inc_votes.', () => {
          const updateReq = {};

          return request(app)
            .patch('/api/articles/1')
            .send(updateReq)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Missing or incorrect data provided for article "1".');
            });
        });
        it('PATCH:400, when the inc_votes is not a valid data type, i.e. number', () => {
          const updateReq = { inc_votes: 'potato' };

          return request(app)
            .patch('/api/articles/1')
            .send(updateReq)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Missing or incorrect data provided for article "1".');
            });
        });
        it('PATCH:400, when other data other than inc_votes is included by client on patch.', () => {
          const updateReq = { inc_votes: 5, other: 'potato' };

          return request(app)
            .patch('/api/articles/1')
            .send(updateReq)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                'Invalid additional data provied for article with "1". Please only include { inc_votes: votes }'
              );
            });
        });
        describe('/comments', () => {
          it('GET:200, returns an array of comments for a given article ID that is valid', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.have.lengthOf(13);
                comments.forEach(comment => {
                  expect(comment).to.have.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']);
                });
              });
          });
          it('GET:200, returns a message when there are no comments for a found article', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Unfortunately, no comments have been made about this article.');
              });
          });
          it('GET:200, returns correctly sorted array of comments with default sort being created_at with default order of descending', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=article_id')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.be.descendingBy('article_id');
              });
          });
          it('GET:200, returns array sorted by the default created_at in ascending order', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.be.ascendingBy('created_at');
              });
          });
          it('GET:200, returns array sorted by non-default column and in non-default order', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc&sort_by=author')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.be.ascendingBy('author');
              });
          });
          it('POST:201, when an object with keys userame and body with valid data are given', () => {
            const postReq = { username: 'rogersop', body: 'Error handling is fun!' };

            return request(app)
              .post('/api/articles/1/comments')
              .send(postReq)
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.have.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']);
                expect(comment.comment_id).to.equal(19);
                expect(comment.author).to.equal(postReq.username);
                expect(comment.body).to.equal(postReq.body);
                expect(comment.votes).to.equal(0);
              });
          });
          describe('ERRORS /comments', () => {
            it('GET:404, when an article is not found', () => {
              return request(app)
                .get('/api/articles/99999/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Article 99999 not found.');
                });
            });
            it('GET:400, when sort_by query is not a valid column', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=banana')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('column "banana" does not exist. Please sort_by a different column.');
                });
            });
            it('POST:400, when body is empty or missing data when article ID is valid', () => {
              const postReq = { username: 'rogersop' };

              return request(app)
                .post('/api/articles/1/comments')
                .send(postReq)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('null value in column "body" violates not-null constraint');
                });
            });
            it('POST:400, when the datatype given is invalid', () => {
              const postReq = { username: 66, body: { story: 'abc' } };

              return request(app)
                .post('/api/articles/1/comments')
                .send(postReq)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(
                    'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
                  );
                });
            });
            // Possibly Change
            it('POST:400, when article ID given is invalid', () => {
              const postReq = { username: 'rogersop', body: 'Error handling is fun!' };

              return request(app)
                .post('/api/articles/99999/comments')
                .send(postReq)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(
                    'insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"'
                  );
                });
            });
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
  describe('ERRORS /*', () => {
    it('GET:404, when invalid URL is given in the root', () => {
      return request(app)
        .get('/invalid')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Error 404 - Invalid URL provided.');
        });
    });
  });
});
