const connection = require('../db/connection');

exports.selectArticleById = article_id => {
  return connection('articles')
    .first()
    .where('id', '=', article_id)
    .then(articleData => {
      if (!articleData) return Promise.reject({ status: 404, msg: `Article ID "${article_id}" does not exist.` });

      const commentPromise = connection('comments')
        .count('*', { as: 'comment_count' })
        .where('article_id', '=', article_id);

      return Promise.all([commentPromise, articleData]);
    })
    .then(articlePromises => {
      const article = articlePromises[1];
      article.comment_count = articlePromises[0][0].comment_count;
      return article;
    });
};

exports.updateArticleById = (id, data) => {
  const { inc_votes, ...otherData } = data;
  // Error handling for bad data requests
  if (!inc_votes || typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: `Missing or incorrect data provided for article "${id}".` });
  }

  if (Object.values(otherData).length) {
    return Promise.reject({
      status: 400,
      msg: `Invalid additional data provied for article with "${id}". Please only include { inc_votes: votes }`
    });
  }

  return connection('articles')
    .first()
    .where('id', '=', id)
    .then(article => {
      article.votes += inc_votes;
      return article;
    });
};
