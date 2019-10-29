const connection = require('../db/connection');

exports.selectUserByUsername = username => {
  return connection('users')
    .first()
    .where({ username });
};
