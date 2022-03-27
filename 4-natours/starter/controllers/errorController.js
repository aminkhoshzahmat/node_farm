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
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack); // shows where the error occurred.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
