const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const userRouter = require('./userRouter');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);

apiRouter.get('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Error 404 - Invalid URL provided.' });
});

module.exports = apiRouter;
