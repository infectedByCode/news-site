const { updateCommentById } = require('../models/comment-models');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, ...otherData } = req.body;

  updateCommentById(comment_id, inc_votes, otherData)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
