const articleRouter = require('express').Router();
const { getArticleById } = require('../controllers/article-controller');

articleRouter.route('/:article_id', getArticleById);

module.exports = articleRouter;
