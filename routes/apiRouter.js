const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);

apiRouter.get('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Error 404 - Invalid URL provided.' });
});

module.exports = apiRouter;
