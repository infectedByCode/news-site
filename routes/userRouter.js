const userRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/user-controller');
const { handle405Errors } = require('../errors');

userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(handle405Errors);

module.exports = userRouter;
