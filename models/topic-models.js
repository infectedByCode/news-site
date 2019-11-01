const connection = require('../db/connection');

exports.selectTopics = (limit = 5, p = 1) => {
  return connection('topics')
    .select('*')
    .limit(limit)
    .offset(limit * (p - 1));
};

exports.createTopic = topicData => {
  const { slug, description, ...otherData } = topicData;

  if (Object.keys(otherData).length)
    return Promise.reject({ status: 400, msg: 'Please only include slug and description.' });

  return connection('topics').insert({ slug, description }, '*');
};
