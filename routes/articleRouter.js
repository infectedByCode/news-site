const articleRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require('../controllers/article-controller');
const { handle405Errors } = require('../errors');

articleRouter
  .route('/')
  .get(getArticles)
  .all(handle405Errors);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405Errors);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405Errors);

module.exports = articleRouter;
