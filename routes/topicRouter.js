const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controllers');
const { invalidURLError } = require('../errors');

topicRouter.route('/').get(getTopics);

topicRouter.get('/*', invalidURLError);

module.exports = topicRouter;
