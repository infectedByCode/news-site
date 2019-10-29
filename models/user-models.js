const connection = require('../db/connection');

exports.selectUserByUsername = username => {
  return connection('users')
    .first()
    .where({ username })
    .then(user => {
      if (!user) {
        return Promise.reject({ status: 404, msg: `Username "${username}" cannot be found.` });
      }
      return user;
    });
};
