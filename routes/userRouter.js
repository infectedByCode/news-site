const userRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/user-controller');
const { invalidURLError } = require('../errors');

userRouter.route('/:username').get(getUserByUsername);

userRouter.get('/*', invalidURLError);

module.exports = userRouter;
