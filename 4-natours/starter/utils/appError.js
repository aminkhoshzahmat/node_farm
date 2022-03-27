/**
 * Operational error handler (14.png) > like no route found, input invalid data, ...
 * extends built-in error class.
 * just es6 class.
 * when we extend a parent class, we call super() in order to
 * call the parent constructor.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    // no need to assign message > this.message..., super will do it for us.
    super(message); // the only parameter which  Error accept.
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    /**
     * To prevent not to mentioning this class and method in stack trace, to this.
     * exclude it. the function call is not going to appear in the stack trace and not polluted.
     * (the current object, the appError class itself)
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// res.status(400).json({
//   status: 'fail',
//   message: `Can't fine ${req.originalUrl} on this server.`,
// });
// ====================================
// const err = new Error(`Can't find ${req.originalUrl} on this server.`);
// err.status = 'fail';
// err.statusCode = 404;
// next(err); // Jump to the error handling middleware, not any middleware in between.
// ====================================
