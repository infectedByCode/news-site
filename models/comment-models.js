const connection = require('../db/connection');

exports.updateCommentById = (comment_id, votesUpdate, otherData) => {
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
