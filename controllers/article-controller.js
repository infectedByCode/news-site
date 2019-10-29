const { selectArticleById, updateArticleById } = require('../models/articles-models');

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
