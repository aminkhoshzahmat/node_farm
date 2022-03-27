/**
 * NOTE: Middleware with 4 arguments, express automatically recognise it as
 * error handling middleware. Therefor it will call it, when there is an error.
 * error first argument.
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack); // shows where the error occurred.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
