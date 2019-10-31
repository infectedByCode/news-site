const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');
const commentRouter = require('./commentRouter');
const { getAPI } = require('../controllers/api-controller');
const { handle405Errors } = require('../errors');

apiRouter
  .route('/')
  .get(getAPI)
  .all(handle405Errors);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
