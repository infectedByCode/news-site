const userRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/user-controller');
const { invalidURLError } = require('../errors');

userRouter.route('/:username').get(getUserByUsername);

module.exports = userRouter;
