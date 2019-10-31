const { selectAPI } = require('../models/api-models');

exports.getAPI = (req, res, next) => {
  selectAPI()
    .then(api => {
      res.status(200).send({ api });
    })
    .then(next);
};
