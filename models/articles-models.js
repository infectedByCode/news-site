const connection = require('../db/connection');

exports.selectArticleById = article_id => {
  return connection('articles')
    .first('articles.*')
    .where('id', '=', article_id)
    .count('comments.comment_id', { as: 'comment_count' })
    .leftJoin('comments', 'articles.id', 'comments.article_id')
    .groupBy('articles.id')
    .returning('*')
    .then(articleData => {
      if (!articleData) return Promise.reject({ status: 404, msg: `Article ID "${article_id}" does not exist.` });
      else return Promise.resolve(articleData);
    });
};

exports.updateArticleById = (id, inc_votes = 0, data) => {
  const { ...otherData } = data;
  // Error handling for bad data requests
  if (typeof inc_votes !== 'number') {
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

  if (typeof username !== 'string')
    return Promise.reject({
      status: 400,
      msg: 'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
    });

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
          .returning('*');
    });
};

exports.selectArticles = (sort_by = 'created_at', order = 'desc', author, topic, limit = 10, p = 1) => {
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
    .modify(query => {
      if (limit || p) query.limit(limit).offset(limit * (p - 1));
    })
    .then(query => {
      // Check if any articles were found.
      // If none, checks where author/topic is valid and sends 400 or 404 dependingly.
      if (!query.length && author) {
        return connection('users')
          .select('*')
          .where('users.username', '=', author)
          .then(query => {
            if (!query.length) return Promise.reject({ status: 404, msg: `Author "${author}" does not exist.` });
            else return Promise.resolve([]);
          });
      }
      if (!query.length && topic) {
        return connection('topics')
          .select('*')
          .where('topics.slug', '=', topic)
          .then(query => {
            if (!query.length) return Promise.reject({ status: 404, msg: `Topic "${topic}" does not exist.` });
            else return Promise.resolve([]);
          });
      }
      return query;
    });
};

exports.removeArticleById = article_id => {
  return connection('articles')
    .del()
    .where('id', '=', article_id)
    .then(deleteCount => {
      if (!deleteCount) return Promise.reject({ status: 404, msg: `Article "${article_id}" cannot be found.` });
    });
};
