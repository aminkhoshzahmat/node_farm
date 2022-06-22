const mongoose = require('mongoose'); // Mongo
const dotenv = require('dotenv');

/**
 * This package helps us to define and populate our variables in nodejs.
 */
dotenv.config({ path: './.env' });

/**
 * Catching uncaught exception
 * use case: refrerence to something that is not declared, console.log(x)
 * NOTE: this listener should be at the top of the app, this way they can catch everything.
 * NOTE: we don't need to shutdown gracefully! because app itself cannot be run with this situation.
 * NOTE: if console.log(x) is inside of any other middleware function, then errorController can't handle it with
 *       our defined handled... methods, it just simply pass the error to console depend on dev or prod mode.
 */
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION! 🔥 Shutting down...`);
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

/**
 * Mongoose
 */
const DB = process.env.DATABASE_DSN_PROD.replace('<password>', process.env.DATABASE_PASSWORD)
  .replace('<username>', process.env.DATABASE_USERNAME)
  .replace('<database_name>', process.env.DATABASE_NAME);

/**
 * Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js,
 * a higher level of abstraction.
 */

mongoose
  .connect(process.env.DATABASE_DSN_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`DB connected successfully to: ${process.env.DATABASE_NAME}`));
// .catch(() => console.log('error')); // but we want to handle it globaly, unhandled rejection

/**
 * Default environment is 'development'
 * custom env variable in command
 * NODE_ENV=development X=23 Amin=Developer nodemon server.js
 */
// console.log(app.get('env')); // NODE_ENV
// console.log(process.env);

/**
 * Start the Server
 */
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port} (${process.env.NODE_ENV})`);
});

/**
 * Use Case: wrong password for mongodb connection in config.env, we can catch in connection setting,
 * but we are looking a global solution for unhandled rejection.
 * NOTE: there is nothing we can do here, it's better to shutdown the application but gracefully!
 *    server.close => this try to close app gracefully, finish all request that are pending then execute the callback function
 *    process.exit() => shutdown app immediatelly
 */
process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION! 🔥 Shutting down...`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
