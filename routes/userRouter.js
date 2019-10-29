const userRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/user-controller');

userRouter.route('/:username').get(getUserByUsername);

module.exports = userRouter;
