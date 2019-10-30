const commentRouter = require('express').Router();
const { patchCommentById, deleteCommentById } = require('../controllers/comment-controller');

commentRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentRouter;
