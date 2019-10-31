const { selectTopics } = require('../models/topic-models');

exports.getTopics = (req, res, next) => {
  const { limit, p } = req.query;

  selectTopics(limit, p).then(topics => {
    res.status(200).send({ topics });
  });
};
