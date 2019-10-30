const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controllers');

topicRouter.route('/').get(getTopics);

module.exports = topicRouter;
