exports.customErrorHandlers = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrorHandlers = (err, req, res, next) => {
  console.log(err.code);
  const errRef = {
    '22P02': {
      status: 400,
      msg: createErrorMessage(err)
    },
    '23502': {
      status: 400,
      msg: createErrorMessage(err)
    },
    '23503': {
      status: 400,
      msg: createErrorMessage(err)
    },
    '42703': {
      status: 400,
      msg: createErrorMessage(err) + '. Please sort_by a different column.'
    }
  };

  if (err.code) {
    res.status(errRef[err.code].status).send({ msg: errRef[err.code].msg });
  }
};

exports.invalidURLError = (req, res, next) => {
  res.status(404).send({ msg: 'Error 404 - Invalid URL provided.' });
};

const createErrorMessage = err => {
  const msg = err.message.split(' - ')[1];
  return msg;
};
