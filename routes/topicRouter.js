const topicRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topic-controllers');
const { handle405Errors } = require('../errors');

topicRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405Errors);

module.exports = topicRouter;
