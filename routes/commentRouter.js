const commentRouter = require('express').Router();
const { patchCommentById } = require('../controllers/comment-controller');

commentRouter.route('/:comment_id').patch(patchCommentById);

module.exports = commentRouter;
