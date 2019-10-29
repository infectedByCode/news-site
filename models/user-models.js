const connection = require('../db/connection');

exports.selectUserByUsername = username => {
  if (username.length > 20)
    return Promise.reject({
      status: 400,
      msg: 'Usernames should be less than 20 characters. Please check and try again.'
    });
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
