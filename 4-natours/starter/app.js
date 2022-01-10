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
const morgan = require('morgan');

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
app.use(morgan('dev'));

/**
 * - Custom Middleware
 * - Never forget to call next(), because without that response will stop at this moment, it won't pass it to next middleware in Middleware stack.
 * - The priority of middlewares are important, they can run step by step after each other. (e.g. put it after routes.)
 *   because middleware cycle will finish.
 */
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.zart = new Date().toISOString();
  next();
});

/**
 * Mounting routers
 */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
