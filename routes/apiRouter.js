const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');

apiRouter.use('/topics', topicRouter);
// Refactor to include in error folder
apiRouter.get('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Error 404 - Invalid URL provided.' });
});

module.exports = apiRouter;
