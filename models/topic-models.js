const connection = require('../db/connection');

exports.selectTopics = (limit = 5, p = 1) => {
  return connection.select('*').from('topics');
  // .limit(limit)
  // .offset(limit * (p - 1));
};
