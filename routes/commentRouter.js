const commentRouter = require('express').Router();

app.route('/:comment_id').patch(patchCommentById);

module.exports = commentRouter;
