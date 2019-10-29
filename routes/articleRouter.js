const articleRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require('../controllers/article-controller');
const { invalidURLError } = require('../errors');

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articleRouter.get('/*', invalidURLError);

module.exports = articleRouter;
