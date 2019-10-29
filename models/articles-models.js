const connection = require('../db/connection');

exports.selectArticleById = article_id => {
  return connection('articles')
    .first()
    .where('id', article_id)
    .then(articleData => {
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
