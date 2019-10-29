exports.customErrorHandlers = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrorHandlers = (err, req, res, next) => {
  const errRef = {
    '22P02': {
      status: 400,
      msg: createErrorMessage(err)
    }
  };

  if (err.code) {
    res.status(errRef[err.code].status).send({ msg: errRef[err.code].msg });
  }
};

const createErrorMessage = err => {
  const msg = err.message.split(' - ')[1];
  return msg;
};
