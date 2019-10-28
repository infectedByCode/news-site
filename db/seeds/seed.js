const { topicData, articleData, commentData, userData } = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics')
        .insert(topicData)
        .returning('*');
      const usersInsertions = knex('users')
        .insert(userData)
        .returning('*');

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const modifiedArticleData = formatDates(articleData);

      return knex('articles')
        .insert(modifiedArticleData)
        .returning('*');
    })
    .then(articleRows => {
      const articleIdRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleIdRef);

      return knex('comments').insert(formattedComments);
    });
};
