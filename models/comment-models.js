const connection = require('../db/connection');

exports.updateCommentById = (comment_id, votesUpdate) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', votesUpdate)
    .returning('*');
};
