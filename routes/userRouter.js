const userRouter = require('express').Router();

userRouter.route('/:username').get(getUserById);

module.exports = userRouter;
