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
    describe('/topics', () => {
      it('GET:200, returns an array of objects object', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an('array');
            expect(topics).to.have.lengthOf(3);
          });
      });
      it('GET:200, each object in the array has keys relevant to topics ', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach(topic => {
              expect(topic).to.have.keys(['slug', 'description']);
            });
          });
      });
      describe('ERRORS /topics', () => {
        it('GET:404, when the client uses incorrect URL', () => {
          return request(app)
            .get('/api/t0pics')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Error 404 - Invalid URL provided.');
            });
        });
        it('STATUS:405, when client attempt an illegal method', () => {
          const invalidMethods = ['put', 'patch', 'post', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/topics')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
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
    describe('/articles', () => {
      it('GET:200, returns an array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.have.lengthOf(12);
          });
      });
      it('GET:200, each article object has appropriate keys', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              if (article.id === 1) {
                // Check article one has correct count
                expect(article.comment_count).to.equal('13');
              }
              expect(article).to.have.keys(['author', 'title', 'id', 'topic', 'created_at', 'votes', 'comment_count']);
            });
          });
      });
      it('GET:200, returns an array of article objects sorted with "created_at" as default sort in descending order', () => {
        return request(app)
          .get('/api/articles?sort_by=created_at')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('created_at');
          });
      });
      it('GET:200, array sorts by non-default columns in descending order', () => {
        return request(app)
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('author');
          });
      });
      it('GET:200, returns an array of article objects sorted with "created_at" as default sort in ascending order', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy('created_at');
          });
      });
      it('GET:200, returns an array of article objects filtered by a specified author', () => {
        return request(app)
          .get('/api/articles?author=rogersop')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.author).to.equal('rogersop');
            });
          });
      });
      it('GET:200, returns an array of article objects filtered by article topic.', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.topic).to.equal('cats');
            });
          });
      });
      it('GET:200, returns an array of article objects filtered by article topic and author.', () => {
        return request(app)
          .get('/api/articles?topic=mitch&author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.topic).to.equal('mitch');
              expect(article.author).to.equal('butter_bridge');
            });
          });
      });
      it('GET:200, returns an array filtered and sorted by non-default values', () => {
        return request(app)
          .get('/api/articles?topic=mitch&author=butter_bridge&sort_by=title&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy('title');
            articles.forEach(article => {
              expect(article.topic).to.equal('mitch');
              expect(article.author).to.equal('butter_bridge');
            });
          });
      });
      describe('ERROR /articles', () => {
        it('GET:404, when the URL is invalid', () => {
          return request(app)
            .get('/api/articless')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Error 404 - Invalid URL provided.');
            });
        });
        it('STATUS:405, when client attempt an illegal method', () => {
          const invalidMethods = ['post', 'put', 'patch', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        it('GET:400, when the sort_by column does not exist', () => {
          return request(app)
            .get('/api/articles?sort_by=cars')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('column "cars" does not exist. Please sort_by a different column.');
            });
        });
        it('GET:404, when no articles were found by given author when author exists', () => {
          const author = 'lurker';
          return request(app)
            .get(`/api/articles?author=${author}`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`No articles can be found by "${author}".`);
            });
        });
        it('GET:400, when author given does not exist', () => {
          const author = 'bananaman';
          return request(app)
            .get(`/api/articles?author=${author}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`Author "${author}" does not exist.`);
            });
        });
        it('GET:404, when no articles were found with topic given', () => {
          const topic = 'paper';
          return request(app)
            .get(`/api/articles?topic=${topic}`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`No articles can be found with topic "${topic}".`);
            });
        });
        it('GET:400, when topic does not exist', () => {
          const topic = 'linux';
          return request(app)
            .get(`/api/articles?topic=${topic}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`Topic "${topic}" does not exist.`);
            });
        });
      });
      describe('/:article_id', () => {
        it('GET:200, returns the correct article object when given a valid article ID.', () => {
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
        it('PATCH:200, returns the updated article when given a valid object of { inc_votes: newVote } is given', () => {
          const updateReq = { inc_votes: 23 };

          return request(app)
            .patch('/api/articles/1')
            .send(updateReq)
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equal(123);
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
          it('STATUS:405, when client attempt an illegal method', () => {
            const invalidMethods = ['put', 'post', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/5')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(methodPromises);
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
                });
            });
            it('GET:200, each comments array should have keys specific to comments', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
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
              it('STATUS:405, when client attempt an illegal method', () => {
                const invalidMethods = ['put', 'patch', 'delete'];
                const methodPromises = invalidMethods.map(method => {
                  return request(app)
                    [method]('/api/articles')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal('method not allowed');
                    });
                });
                return Promise.all(methodPromises);
              });
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
              it('POST:400, when the datatype given is invalid for username', () => {
                const postReq = { username: 66, body: 'Awesome cats' };

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
    });
    describe('/comments', () => {
      describe('/:comment:id', () => {
        it('PATCH:200, returns the updated comment vote', () => {
          const updateReq = { inc_votes: 5 };

          return request(app)
            .patch('/api/comments/1')
            .send(updateReq)
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(21);
            });
        });
        it('PATCH:200, retains updated comment in full with relevant keys', () => {
          const updateReq = { inc_votes: 5 };

          return request(app)
            .patch('/api/comments/1')
            .send(updateReq)
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).to.have.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']);
            });
        });
        it('PATCH:200, returns the unchanged comment when votes is zero', () => {
          const updateReq = { inc_votes: 0 };

          return request(app)
            .patch('/api/comments/1')
            .send(updateReq)
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(16);
              expect(comment).to.have.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']);
            });
        });
        it('DELETE:204, returns status code 204 when a valid comment ID is given and deleted.', () => {
          const comment_id = 1;

          return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(204);
        });
        it('DELETE:204, deleted comment can no longer be found in database.', () => {
          const id = 1;
          const articleOfComment = 9;
          return request(app)
            .delete(`/api/comments/${id}`)
            .expect(204)
            .then(() => {
              return request(app)
                .get(`/api/articles/${articleOfComment}/comments`)
                .then(({ body: { comments } }) => {
                  const isCommentFound = Boolean(comments.find(comment => comment.comment_id === id));
                  expect(isCommentFound).to.be.false;
                });
            });
        });
        describe('ERRORS /:comment_id', () => {
          it('STATUS:405, when client attempt an illegal method', () => {
            const invalidMethods = ['put', 'get', 'post'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/comments/2')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(methodPromises);
          });
          it('PATCH:404, when the comment ID is a valid format but not found', () => {
            const updateReq = { inc_votes: 5 };
            const comment_id = 1999;

            return request(app)
              .patch(`/api/comments/${comment_id}`)
              .send(updateReq)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Comment "${comment_id}" cannot be found.`);
              });
          });
          it('PATCH:400, when the comment_id is an invalid format', () => {
            const updateReq = { inc_votes: 5 };
            const comment_id = 'Not-really-a-num';

            return request(app)
              .patch(`/api/comments/${comment_id}`)
              .send(updateReq)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`invalid input syntax for integer: "Not-really-a-num"`);
              });
          });
          it('PATCH:400, when the inc_votes data type is not suitable', () => {
            const updateReq = { inc_votes: 'kangaroos' };

            return request(app)
              .patch('/api/comments/1')
              .send(updateReq)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('invalid input syntax for integer: "NaN"');
              });
          });
          it('PATCH:400, when the data contains other data than inc_votes', () => {
            const updateReq = { inc_votes: 5, other_col: 1000 };

            return request(app)
              .patch('/api/comments/1')
              .send(updateReq)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Please only include { inc_votes: "number" } when using the API');
              });
          });
          it('DELETE:400, when the ID is not a valid data type', () => {
            const comment_id = 'not-comment-id';

            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('invalid input syntax for integer: "not-comment-id"');
              });
          });
          it('DELETE 400, when the ID is valid but not found in database', () => {
            const comment_id = 9999;

            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Comment with ID "${comment_id}" could not be found.`);
              });
          });
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
