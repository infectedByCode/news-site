const articleRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/article-controller');

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articleRouter;
