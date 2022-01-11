const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

/**
 * This package helps us to define and populate our variables in nodejs.
 */

/**
 * Default environment is 'development'
 * custom env variable in command
 * NODE_ENV=development X=23 Amin=Developer nodemon server.js
 */
console.log(app.get('env')); // NODE_ENV
console.log(process.env);

/**
 * Start the Server
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
