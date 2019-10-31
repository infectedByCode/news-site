const connection = require('../db/connection');

exports.updateCommentById = (comment_id, votesUpdate = 0, otherData) => {
  if (Object.keys(otherData).length)
    return Promise.reject({ status: 400, msg: 'Please only include { inc_votes: "number" } when using the API' });

  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', votesUpdate)
    .returning('*')
    .then(comment => {
      if (!comment.length) return Promise.reject({ status: 404, msg: `Comment "${comment_id}" cannot be found.` });
      else return Promise.resolve(comment);
    });
};

exports.removeCommentById = comment_id => {
  return connection('comments')
    .where({ comment_id })
    .del()
    .returning('*')
    .then(comment => {
      if (!comment.length)
        return Promise.reject({ status: 404, msg: `Comment with ID "${comment_id}" could not be found.` });
      else return Promise.resolve(null);
    });
};
