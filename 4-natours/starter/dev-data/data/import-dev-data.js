const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// ENVIRONMENT VARIABLES
dotenv.config({ path: './config.env' });

// PROD CONNECTION
const DB_PROD = process.env.DATABASE_DSN_PROD.replace('<password>', process.env.DATABASE_PASSWORD)
  .replace('<username>', process.env.DATABASE_USERNAME)
  .replace('<database_name>', process.env.DATABASE_NAME);

// LOCAL CONNECTION
const DB_LOCAL = process.env.DATABASE_DSN_LOCAL;

// CONNECTION
mongoose.connect(DB_LOCAL, {
  useNewUrlParser: true,
});

// READ JSON FILES
console.log(process.argv);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // aggressive way of exiting the application.
};

// Remember that mongoose is just like a layer of abstraction on top of MongoDB

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully delete.');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // aggressive way of exiting the application.
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
