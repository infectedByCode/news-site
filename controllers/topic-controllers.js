const { selectTopics, createTopic } = require('../models/topic-models');

exports.getTopics = (req, res, next) => {
  const { limit, p } = req.query;

  selectTopics(limit, p).then(topics => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { ...topicData } = req.body;

  createTopic(topicData)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
