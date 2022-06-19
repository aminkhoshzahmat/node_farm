const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another values`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log(err.erros);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('Error 💥', err);
    // 2) Send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

/**
 * NOTE: Middleware with 4 arguments, express automatically recognise it as
 * error handling middleware. Therefor it will call it, when there is an error.
 * error first argument.
 * By default, we assume that errors are operational.
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack); // shows where the error occurred.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065206#questions/11418172
    // In new versions, "name" and "message" properties don't exist anymore after "deconstructing" the "err" argument.
    // let error = { ...err }; // we don't want to override actual express err.

    let error = { name: err.name, message: err.message, errors: err.errors };
    error = Object.assign(error, err);

    if (error.name === 'CastError') error = handleCastErrorDB(error); // operational error handler for mongoose
    if (error.code === 11000) error = handleDuplicateFieldDB(error); // operational error handler for mongo
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error); // operational error handler for mongoose
    console.log(error.errors);
    sendErrorProd(error, res);
  }
};
