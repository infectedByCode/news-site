const articleRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require('../controllers/article-controller');
const { invalidURLError } = require('../errors');

articleRouter.route('/').get(getArticles);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articleRouter;
