const {
  selectArticleById,
  updateArticleById,
  createCommentByArticleId,
  selectCommentsByArticleId,
  selectArticles,
  removeArticleById
} = require('../models/articles-models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes, ...data } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, inc_votes, data)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;

  createCommentByArticleId(article_id, data)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;

  selectArticles(sort_by, order, author, topic, limit, p)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id).then(() => {
    res.sendStatus(204);
  });
};
