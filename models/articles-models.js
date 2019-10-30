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
  // Increment vote count, then return with comment_count included
  return connection('articles')
    .where('id', '=', id)
    .increment('votes', inc_votes)
    .then(() => {
      return connection('articles')
        .select('articles.*')
        .where('id', '=', id)
        .count('comments.comment_id', { as: 'comment_count' })
        .leftJoin('comments', 'articles.id', 'comments.article_id')
        .groupBy('articles.id')
        .returning('*');
    });
};

exports.createCommentByArticleId = (article_id, data) => {
  const { body, username } = data;

  return connection('comments')
    .insert({
      article_id,
      author: username,
      body
    })
    .returning('*');
};

exports.selectCommentsByArticleId = (article_id, sort_by = 'created_at', order = 'desc') => {
  return connection('articles')
    .first()
    .where('id', '=', article_id)
    .then(article => {
      if (!article) return Promise.reject({ status: 404, msg: `Article ${article_id} not found.` });
      else
        return connection('comments')
          .select('*')
          .where({ article_id })
          .orderBy(sort_by, order)
          .returning('*')
          .then(comments => {
            if (!comments.length)
              return Promise.reject({
                status: 200,
                msg: 'Unfortunately, no comments have been made about this article.'
              });
            else return comments;
          });
    });
};

exports.selectArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
  return connection('articles')
    .select(
      'articles.id',
      'articles.title',
      'articles.topic',
      'articles.created_at',
      'articles.votes',
      'articles.author'
    )
    .count('comments.comment_id', { as: 'comment_count' })
    .leftJoin('comments', 'articles.id', 'comments.article_id')
    .groupBy('articles.id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (author && topic) query.where('articles.author', author).andWhere('articles.topic', topic);
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
    })
    .then(query => {
      // Check if any articles were found.
      // If none, checks where author/topic is valid and sends 400 or 404 dependingly.
      if (!query.length && author) {
        return connection('users')
          .select('*')
          .where('users.username', '=', author)
          .then(query => {
            if (!query.length) return Promise.reject({ status: 400, msg: `Author "${author}" does not exist.` });
            else return Promise.reject({ status: 404, msg: `No articles can be found by "${author}".` });
          });
      }
      if (!query.length && topic) {
        return connection('topics')
          .select('*')
          .where('topics.slug', '=', topic)
          .then(query => {
            if (!query.length) return Promise.reject({ status: 400, msg: `Topic "${topic}" does not exist.` });
            else return Promise.reject({ status: 404, msg: `No articles can be found with topic "${topic}".` });
          });
      }
      return query;
    });
};
