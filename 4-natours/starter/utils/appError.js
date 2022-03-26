/**
 * Operational error handler (14.png)
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
