const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controllers');
const { handle405Errors } = require('../errors');

topicRouter
  .route('/')
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicRouter;
