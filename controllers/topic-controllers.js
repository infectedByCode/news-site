const { selectTopics } = require('../models/topic-models');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
