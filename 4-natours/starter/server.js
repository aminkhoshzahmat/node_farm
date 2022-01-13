const mongoose = require('mongoose'); // Mongo
const dotenv = require('dotenv');
const app = require('./app');

/**
 * This package helps us to define and populate our variables in nodejs.
 */
dotenv.config({ path: './config.env' });

/**
 * Mongoose
 */
const DB = process.env.DATABASE_DSN_PROD.replace('<password>', process.env.DATABASE_PASSWORD)
  .replace('<username>', process.env.DATABASE_USERNAME)
  .replace('<database_name>', process.env.DATABASE_NAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`DB connected successfully to: ${process.env.DATABASE_NAME}`));

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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
