/**
 * - If no route found, express will handle it with default not route found.
 * - Add headers to response like .json --> Content-Type: application/json, X-Powered-By: Express
 * - /:id/:x/:y?  > with ? we can make a variable optional in URL
 *
 */

/**
 * Require modules
 */
const express = require('express');
const morgan = require('morgan'); // Logger

const AppError = require('./utils/appError');
const globalErrorHanlder = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/**
 * Setup Server and Middleware,
 * Everything is middleware, event routers
 * All the middlewares together that we use in our app, is called MIDDLEWARE STACK
 */
const app = express();

/**
 * Middleware
 */
app.use(express.json()); //  To get access to the request body on the request object, This is a middleware stands between request and response.
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * - Custom Middleware
 * - Never forget to call next(), because without that response will stop at this moment, it won't pass it to next middleware in Middleware stack.
 * - The priority of middlewares are important, they can run step by step after each other. (e.g. put it after routes.)
 *   because middleware cycle will finish.
 */
// app.use((req, res, next) => {
//   console.log('hello from middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.zart = new Date().toISOString();
  next();
});

/**
 * Mounting routers
 * The order of the routes matters.
 */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 * If you reach this line of code, it means no route found.
 * All methods.
 * NOTE: If we don't call the next, app will stop here, but if we call it with error,
 * we will move to next middleware but the one which is for error handling, HOW?
 * express will look only for the error handling middleware, and not pass to other middleware in between.
 */
app.all('*', (req, res, next) => {
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
  next(new AppError(`Can't fine ${req.originalUrl} on this server.`, 404));
});

/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 * NOTE: Middleware with 4 arguments, express automatically recognise it as
 * error handling middleware. Therefor it will call it, when there is an error.
 * error first argument.
 */
app.use(globalErrorHanlder);

module.exports = app;

// test for eslint
// const x = 44;
// x = 3;
