const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter.js');

apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;
