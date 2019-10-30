const commentRouter = require('express').Router();
const { patchCommentById, deleteCommentById } = require('../controllers/comment-controller');
const { handle405Errors } = require('../errors');

commentRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405Errors);

module.exports = commentRouter;
