const connection = require('../db/connection');

exports.updateCommentById = (comment_id, votesUpdate) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', votesUpdate)
    .returning('*')
    .then(comment => {
      if (!comment.length) return Promise.reject({ status: 404, msg: `Comment "${comment_id}" cannot be found.` });
      else return Promise.resolve(comment);
    });
};
