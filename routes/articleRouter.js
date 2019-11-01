const articleRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  deleteArticleById,
  postArticle
} = require('../controllers/article-controller');
const { handle405Errors } = require('../errors');

articleRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(handle405Errors);

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(handle405Errors);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405Errors);

module.exports = articleRouter;
