const {
  selectArticleById,
  updateArticleById,
  createCommentByArticleId,
  selectCommentsByArticleId
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
  const { ...data } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, data)
    .then(article => {
      res.status(201).send({ article });
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

  selectCommentsByArticleId(article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
